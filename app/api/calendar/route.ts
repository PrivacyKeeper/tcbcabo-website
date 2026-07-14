export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Public: list blocked dates.
// Optional ?boatId=xxx filters dates for one boat.
// ?detailed=true returns management details and requires authentication.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get("detailed") === "true";
    const boatId = searchParams.get("boatId");

    if (detailed) {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const blockedDates = await prisma.blockedDate.findMany({
      where: boatId
        ? {
            OR: [
              { boatId },
              { boatId: null },
            ],
          }
        : undefined,
    include: {
  boat: {
    select: {
      id: true,
      name: true,
    },
  },
},
      orderBy: { date: "asc" },
    });

    if (detailed) {
      return NextResponse.json(
        blockedDates.map((blockedDate) => ({
          id: blockedDate.id,
          date: blockedDate.date.toISOString(),
          reason: blockedDate.reason,
          isBooking: Boolean(blockedDate.bookingId),
          boatId: blockedDate.boatId,
          boatName: blockedDate.boat?.name ?? null,
        }))
      );
    }

    return NextResponse.json(
      blockedDates.map((blockedDate) =>
        blockedDate.date.toISOString()
      )
    );
  } catch (error: unknown) {
    console.error("Calendar error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// Captain-only: add a blackout date.
// boatId is optional until multiple boats are configured.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { date, reason, boatId } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const normalized = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    );

    const normalizedBoatId =
      typeof boatId === "string" && boatId.trim()
        ? boatId.trim()
        : null;

    const existing = await prisma.blockedDate.findFirst({
      where: {
        date: normalized,
        boatId: normalizedBoatId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "That date is already blocked" },
        { status: 409 }
      );
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        boatId: normalizedBoatId,
        date: normalized,
        reason: reason || "Blackout (captain)",
      },
    });

    return NextResponse.json(blockedDate);
  } catch (error: unknown) {
    console.error("Add blackout error:", error);

    return NextResponse.json(
      { error: "Failed to add blackout date" },
      { status: 500 }
    );
  }
}

// Captain-only: remove a manual blackout.
// Confirmed-booking locks cannot be removed here.
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { date, boatId } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const normalized = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    );

    const normalizedBoatId =
      typeof boatId === "string" && boatId.trim()
        ? boatId.trim()
        : null;

    const existing = await prisma.blockedDate.findFirst({
      where: {
        date: normalized,
        boatId: normalizedBoatId,
      },
    });

    if (existing?.bookingId) {
      return NextResponse.json(
        {
          error:
            "This date is locked by a confirmed booking and cannot be removed here.",
        },
        { status: 409 }
      );
    }

    await prisma.blockedDate.deleteMany({
      where: {
        date: normalized,
        boatId: normalizedBoatId,
        bookingId: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Remove blackout error:", error);

    return NextResponse.json(
      { error: "Failed to remove blackout date" },
      { status: 500 }
    );
  }
}