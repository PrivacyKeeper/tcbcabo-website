"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  CalendarX,
  Check,
  ClipboardList,
  Fish,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Send,
  Trash2,
  Upload,
  Waves,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SPECIES_OPTIONS = [
  "Blue Marlin",
  "Striped Marlin",
  "Yellowfin Tuna",
  "Dorado",
  "Wahoo",
  "Roosterfish",
  "Sailfish",
  "Swordfish",
  "Skipjack",
];

type Boat = {
  id: string;
  name: string;
  slug: string;
};

type UploadedPhoto = {
  storageKey: string;
  previewUrl: string;
  previewExpiresIn: number;
  originalName: string;
  boat: Boat;
};

export function DashboardContent() {
  const { status } = useSession() || {};
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "report" | "bookings" | "calendar"
  >("report");

  const [reports, setReports] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);

  const [selectedBoatId, setSelectedBoatId] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [savingBlackout, setSavingBlackout] = useState(false);

  const [title, setTitle] = useState("");
  const [conditions, setConditions] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [species, setSpecies] = useState<string[]>([]);
  const [catches, setCatches] = useState("");
  const [highlights, setHighlights] = useState("");
  const [hotspots, setHotspots] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/captain/login");
    }
  }, [status, router]);

  const fetchBoats = useCallback(async () => {
    try {
      const res = await fetch("/api/boats");

      if (!res.ok) {
        throw new Error("Failed to load boats");
      }

      const data: Boat[] = await res.json();
      setBoats(data ?? []);

      setSelectedBoatId((current) => {
        if (current) return current;
        return data?.[0]?.id ?? "";
      });
    } catch {
      toast.error("Failed to load boats");
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data ?? []);
    } catch {
      toast.error("Failed to load reports");
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");

      if (res.ok) {
        const data = await res.json();
        setBookings(data ?? []);
      }
    } catch {
      toast.error("Failed to load bookings");
    }
  }, []);

  const fetchBlocked = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar?detailed=true");

      if (res.ok) {
        const data = await res.json();
        setBlocked(data ?? []);
      }
    } catch {
      toast.error("Failed to load blocked dates");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBoats();
      fetchReports();
      fetchBookings();
      fetchBlocked();
    }
  }, [status, fetchBoats, fetchReports, fetchBookings, fetchBlocked]);

  const toggleSpecies = useCallback((item: string) => {
    setSpecies((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }, []);

  const uploadPhotos = useCallback(
    async (files: FileList | null) => {
      if (!selectedBoatId) {
        toast.error("Select a boat first");
        return;
      }

      const selectedFiles = Array.from(files ?? []);

      if (selectedFiles.length === 0) return;

      if (uploadedPhotos.length + selectedFiles.length > 10) {
        toast.error("Maximum 10 photos per report");
        return;
      }

      setUploadingPhotos(true);

      try {
        const completed: UploadedPhoto[] = [];

        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("boatId", selectedBoatId);

          const res = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(data?.error ?? "Photo upload failed");
          }

          completed.push(data as UploadedPhoto);
        }

        setUploadedPhotos((current) => [...current, ...completed]);

        toast.success(
          completed.length === 1
            ? "Photo uploaded"
            : `${completed.length} photos uploaded`,
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Photo upload failed",
        );
      } finally {
        setUploadingPhotos(false);
      }
    },
    [selectedBoatId, uploadedPhotos.length],
  );

  const removeUploadedPhoto = useCallback((storageKey: string) => {
    setUploadedPhotos((current) =>
      current.filter((photo) => photo.storageKey !== storageKey),
    );
  }, []);

  const resetReportForm = useCallback(() => {
    setTitle("");
    setConditions("");
    setWaterTemp("");
    setSpecies([]);
    setCatches("");
    setHighlights("");
    setHotspots("");
    setUploadedPhotos([]);
  }, []);

  const submitReport = useCallback(async () => {
    if (!selectedBoatId) {
      toast.error("Select a boat");
      return;
    }

    if (!title.trim()) {
      toast.error("Add a title");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boatId: selectedBoatId,
          title,
          conditions,
          waterTemp,
          species,
          catches,
          highlights,
          hotspots,
          storageKeys: uploadedPhotos.map((photo) => photo.storageKey),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to publish report");
      }

      toast.success("Fishing report published");
      resetReportForm();
      fetchReports();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish report",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedBoatId,
    title,
    conditions,
    waterTemp,
    species,
    catches,
    highlights,
    hotspots,
    uploadedPhotos,
    resetReportForm,
    fetchReports,
  ]);

  const addBlackout = useCallback(async () => {
    if (!newDate) {
      toast.error("Pick a date");
      return;
    }

    setSavingBlackout(true);

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          reason: newReason,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to block date");
      }

      toast.success("Date blocked off");
      setNewDate("");
      setNewReason("");
      fetchBlocked();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to block date",
      );
    } finally {
      setSavingBlackout(false);
    }
  }, [newDate, newReason, fetchBlocked]);

  const removeBlackout = useCallback(
    async (date: string) => {
      try {
        const res = await fetch("/api/calendar", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to remove date");
        }

        toast.success("Date opened back up");
        fetchBlocked();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to remove date",
        );
      }
    },
    [fetchBlocked],
  );

  const toggleDeposit = useCallback(
    async (id: string, currentValue: boolean) => {
      try {
        const res = await fetch(`/api/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            depositPaid: !currentValue,
            status: !currentValue ? "confirmed" : "pending",
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to update booking");
        }

        toast.success(
          !currentValue
            ? "Deposit confirmed – date blocked!"
            : "Deposit unmarked",
        );

        fetchBookings();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update booking",
        );
      }
    },
    [fetchBookings],
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[800px] items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">
              <span className="text-gold-gradient">Striped World</span>
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                Captain
              </span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/captain/login" })}
          >
            <LogOut className="mr-1 h-4 w-4" />
            Out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-4">
        <div className="mb-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("report")}
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-3 text-xs font-medium transition-all sm:text-sm ${
              activeTab === "report"
                ? "bg-primary text-primary-foreground"
                : "border border-border/30 bg-card text-muted-foreground"
            }`}
          >
            <Fish className="h-4 w-4" />
            Report
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-3 text-xs font-medium transition-all sm:text-sm ${
              activeTab === "bookings"
                ? "bg-primary text-primary-foreground"
                : "border border-border/30 bg-card text-muted-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Bookings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-3 text-xs font-medium transition-all sm:text-sm ${
              activeTab === "calendar"
                ? "bg-primary text-primary-foreground"
                : "border border-border/30 bg-card text-muted-foreground"
            }`}
          >
            <CalendarX className="h-4 w-4" />
            Calendar
          </button>
        </div>

        {activeTab === "report" && (
          <section className="space-y-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                <Plus className="h-5 w-5 text-primary" />
                New Fishing Report
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select the boat, add photos and details, then publish.
              </p>
            </div>

            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Boat *
              </Label>

              <Select
                value={selectedBoatId}
                onValueChange={(value) => {
                  if (uploadedPhotos.length > 0 && value !== selectedBoatId) {
                    toast.error("Remove uploaded photos before changing boats");
                    return;
                  }

                  setSelectedBoatId(value);
                }}
                disabled={boats.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a boat" />
                </SelectTrigger>

                <SelectContent>
                  {boats.map((boat) => (
                    <SelectItem key={boat.id} value={boat.id}>
                      {boat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {boats.length === 0 && (
                <p className="mt-1 text-xs text-destructive">
                  No active boats are available.
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Report Title *
              </Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Hot Marlin Bite Today!"
              />
            </div>

            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">
                Photos ({uploadedPhotos.length}/10)
              </Label>

              <label
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 bg-card px-4 py-5 text-center ${
                  !selectedBoatId || uploadingPhotos
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-primary/50"
                }`}
              >
                {uploadingPhotos ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-sm">Uploading photos...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">
                      Tap to choose photos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPEG, PNG or WebP — maximum 10
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={!selectedBoatId || uploadingPhotos}
                  onChange={(event) => {
                    uploadPhotos(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {uploadedPhotos.map((photo, index) => (
                    <div
                      key={photo.storageKey}
                      className="relative aspect-square overflow-hidden rounded-lg border border-border/30 bg-card"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={`Fishing report upload ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        aria-label={`Remove photo ${index + 1}`}
                        onClick={() => removeUploadedPhoto(photo.storageKey)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">
                Species Caught
              </Label>

              <div className="flex flex-wrap gap-2">
                {SPECIES_OPTIONS.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleSpecies(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      species.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/30 bg-card text-muted-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">
                  Conditions
                </Label>
                <Input
                  value={conditions}
                  onChange={(event) => setConditions(event.target.value)}
                  placeholder="Calm seas"
                />
              </div>

              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">
                  Water Temp
                </Label>
                <Input
                  value={waterTemp}
                  onChange={(event) => setWaterTemp(event.target.value)}
                  placeholder="78°F"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Catches
              </Label>
              <Input
                value={catches}
                onChange={(event) => setCatches(event.target.value)}
                placeholder="2 marlin released, 3 tuna"
              />
            </div>

            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Hotspots
              </Label>
              <Input
                value={hotspots}
                onChange={(event) => setHotspots(event.target.value)}
                placeholder="Gordo Banks, 11 Spot"
              />
            </div>

            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Highlights
              </Label>
              <Textarea
                value={highlights}
                onChange={(event) => setHighlights(event.target.value)}
                placeholder="Quick summary of the day..."
                rows={3}
              />
            </div>

            <Button
              onClick={submitReport}
              disabled={
                submitting ||
                uploadingPhotos ||
                !selectedBoatId ||
                !title.trim()
              }
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Report
                </>
              )}
            </Button>

            {reports.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Reports
                </h3>

                <div className="space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div
                      key={report?.id}
                      className="rounded-lg border border-border/30 bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{report?.title}</p>
                          {report?.boat?.name && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {report.boat.name}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {report?.date
                            ? new Date(report.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : ""}
                        </span>
                      </div>

                      {(report?.species?.length ?? 0) > 0 && (
                        <p className="mt-2 text-xs text-primary">
                          {report.species.join(", ")}
                        </p>
                      )}

                      {(report?.images?.length ?? 0) > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {report.images
                            .filter((image: any) => image?.url)
                            .slice(0, 4)
                            .map((image: any) => (
                              <img
                                key={image.id}
                                src={image.url}
                                alt={
                                  image.altText ??
                                  `${report.title} fishing photo`
                                }
                                className="aspect-square w-full rounded object-cover"
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "bookings" && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              <ClipboardList className="h-5 w-5 text-primary" />
              Bookings
            </h2>

            {bookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking?.id}
                    className={`rounded-lg border bg-card p-4 ${
                      booking?.depositPaid
                        ? "border-primary/30"
                        : "border-border/30"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {booking?.guestName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking?.charterType}{" "}
                          {booking?.charterDuration
                            ? `• ${booking.charterDuration}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          booking?.depositPaid
                            ? "bg-primary/15 text-primary"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {booking?.depositPaid ? "Confirmed" : "Pending"}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {booking?.charterDate
                          ? new Date(booking.charterDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )
                          : ""}
                      </span>

                      <span>
                        ${(booking?.totalPrice ?? 0).toLocaleString()}
                      </span>

                      <span>{booking?.guestCount ?? 1} guests</span>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{booking?.guestEmail}</p>
                      <p>{booking?.guestPhone}</p>
                    </div>

                    <Button
                      size="sm"
                      variant={booking?.depositPaid ? "outline" : "default"}
                      onClick={() =>
                        toggleDeposit(booking?.id, booking?.depositPaid)
                      }
                      className="mt-3 text-xs"
                    >
                      {booking?.depositPaid ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Deposit Paid
                        </>
                      ) : (
                        "Mark Deposit Paid"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "calendar" && (
          <section className="space-y-5">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                <CalendarX className="h-5 w-5 text-primary" />
                Block Off Dates
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Block personal days, maintenance or other unavailable dates.
                Confirmed bookings are locked.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-border/30 bg-card p-4">
              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">
                  Date to block *
                </Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(event) => setNewDate(event.target.value)}
                />
              </div>

              <div>
                <Label className="mb-1 block text-xs text-muted-foreground">
                  Reason
                </Label>
                <Input
                  value={newReason}
                  onChange={(event) => setNewReason(event.target.value)}
                  placeholder="Maintenance, personal day, etc."
                />
              </div>

              <Button
                onClick={addBlackout}
                disabled={savingBlackout}
                className="w-full"
              >
                {savingBlackout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Blocking...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Block This Date
                  </>
                )}
              </Button>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Blocked Dates
              </h3>

              {blocked.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No dates blocked. All dates are open for booking.
                </p>
              ) : (
                <div className="space-y-2">
                  {blocked.map((date) => (
                    <div
                      key={date?.date}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/30 bg-card p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-sm font-medium">
                            {date?.date
                              ? new Date(date.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  },
                                )
                              : ""}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {date?.isBooking
                              ? "Confirmed booking"
                              : (date?.reason ?? "Blackout")}
                          </p>
                        </div>
                      </div>

                      {date?.isBooking ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBlackout(date?.date)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
