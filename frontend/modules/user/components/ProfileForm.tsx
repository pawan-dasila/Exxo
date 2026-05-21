"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfileAction } from "../actions/action";

interface ProfileFormProps {
  initialData: {
    full_name: string;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const parts = (initialData.full_name || "").split(" ");
  const initialFirstName = parts[0] || "";
  const initialLastName = parts.slice(1).join(" ") || "";

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialData.email);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("email", email.trim());
      if (phoneNumber.trim()) {
        formData.append("phoneNumber", phoneNumber.trim());
      }

      const res = await updateProfileAction(formData);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile settings.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="border-b border-neutral-50 bg-neutral-50/40 p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-neutral-400">
              Update your account details and profile information.
            </CardDescription>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100 shadow-sm">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Active Member
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                First Name
              </Label>
              <Input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="rounded-xl border-neutral-200 text-xs font-semibold focus-visible:ring-blue-600/20 focus-visible:border-blue-600 py-5 px-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Last Name
              </Label>
              <Input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="rounded-xl border-neutral-200 text-xs font-semibold focus-visible:ring-blue-600/20 focus-visible:border-blue-600 py-5 px-4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
                className="rounded-xl bg-neutral-50/50 border-neutral-200 text-xs font-semibold py-5 px-4 cursor-not-allowed text-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-neutral-400" />
                Phone Number
              </Label>
              <Input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-xl border-neutral-200 text-xs font-semibold focus-visible:ring-blue-600/20 focus-visible:border-blue-600 py-5 px-4"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-neutral-50">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-5.5 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
