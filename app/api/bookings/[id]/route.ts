export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data,
    });

    // If the deposit is marked as paid, block this date for the assigned boat.
    if (data.depositPaid === true) {
      if (booking.boatId) {
        await prisma.blockedDate.upsert({
          where: {
            boatId_date: {
              boatId: booking.boatId,
              date: booking.charterDate,
            },
          },
          update: {
            bookingId: booking.id,
            reason: "Booking confirmed",
          },
          create: {
            boatId: booking.boatId,
            date: booking.charterDate,
            bookingId: booking.id,
            reason: "Booking confirmed",
          },
        });
      } else {
        // Temporary compatibility for bookings created before boats are assigned.
        const existingBlockedDate = await prisma.blockedDate.findFirst({
          where: {
            boatId: null,
            date: booking.charterDate,
          },
        });

        if (existingBlockedDate) {
          await prisma.blockedDate.update({
            where: { id: existingBlockedDate.id },
            data: {
              bookingId: booking.id,
              reason: "Booking confirmed",
            },
          });
        } else {
          await prisma.blockedDate.create({
            data: {
              date: booking.charterDate,
              bookingId: booking.id,
              reason: "Booking confirmed",
            },
          });
        }
      }
    }

    return NextResponse.json(booking);
  } catch (error: unknown) {
    console.error("Update booking error:", error);

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (booking) {
      await prisma.blockedDate.deleteMany({
        where: { bookingId: booking.id },
      });
    }

    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete booking error:", error);

    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}