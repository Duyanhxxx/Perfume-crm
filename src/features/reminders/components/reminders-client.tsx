"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createReminderAction, deleteReminderAction, completeReminderAction } from "@/features/reminders/actions";
import { createReminderSchema, type CreateReminderInput } from "@/features/reminders/schemas";

type ReminderRow = {
  id: string;
  dueAt: string;
  completedAt: string | null;
  note: string | null;
};

export function RemindersClient({
  customerId,
  reminders,
}: {
  customerId: string;
  reminders: ReminderRow[];
}) {
  const form = useForm<CreateReminderInput>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: { customerId, dueAt: "", note: "" },
  });

  const [pending, startTransition] = React.useTransition();

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            try {
              await createReminderAction(values);
              toast.success("Reminder created");
              form.reset({ customerId, dueAt: "", note: "" });
            } catch (e: unknown) {
              const message =
                e && typeof e === "object" && "message" in e
                  ? String((e as { message: unknown }).message)
                  : "Failed";
              toast.error(message);
            }
          });
        })}
      >
        <Input type="hidden" {...form.register("customerId")} />
        <Input
          type="datetime-local"
          className="sm:max-w-[220px]"
          {...form.register("dueAt")}
        />
        <Input placeholder="Reminder note…" {...form.register("note")} />
        <Button type="submit" disabled={pending}>
          Add
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Due</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                No reminders yet.
              </TableCell>
            </TableRow>
          ) : (
            reminders.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(r.dueAt).toLocaleString()}
                </TableCell>
                <TableCell>{r.note ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {r.completedAt ? "Completed" : "Open"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    {!r.completedAt ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          startTransition(async () => {
                            await completeReminderAction({ id: r.id, customerId });
                            toast.success("Completed");
                          })
                        }
                      >
                        Complete
                      </Button>
                    ) : null}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete reminder"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteReminderAction({ id: r.id, customerId });
                          toast.success("Deleted");
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

