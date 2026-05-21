"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Loader2,
  Home,
  Globe,
  Sparkles,
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
import { Address } from "../types";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
} from "../actions/action";

interface AddressManagerProps {
  initialAddresses: Address[];
}

export function AddressManager({ initialAddresses }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form states
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setZipCode("");
    setIsDefault(false);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  const handleEditClick = (address: Address) => {
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setCountry(address.country);
    setZipCode(address.zipCode);
    setIsDefault(address.isDefault);
    setEditingAddressId(address.id);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const payload = {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        zipCode: zipCode.trim(),
        isDefault,
      };

      if (editingAddressId) {
        const res = await updateAddressAction(editingAddressId, payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Address updated successfully!");
          // Update local state
          setAddresses((prev) =>
            prev.map((addr) => {
              if (addr.id === editingAddressId) {
                return { ...addr, ...payload } as Address;
              }
              // If this was set as default, unset others
              if (payload.isDefault && addr.id !== editingAddressId) {
                return { ...addr, isDefault: false };
              }
              return addr;
            }),
          );
          resetForm();
        }
      } else {
        const res = await addAddressAction(payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Address added successfully!");
          const newAddress = res.data as Address;
          setAddresses((prev) => {
            const list = payload.isDefault
              ? prev.map((a) => ({ ...a, isDefault: false }))
              : prev;
            return [...list, newAddress];
          });
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address details.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setDeletingId(id);

    try {
      const res = await deleteAddressAction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Address deleted successfully!");
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      const res = await updateAddressAction(address.id, { isDefault: true });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Default address updated!");
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === address.id,
          })),
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <MapPin className="h-4.5 w-4.5 text-blue-600" />
          Saved Addresses
        </h3>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl px-4 py-2.5 shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            Add Address
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isEditing && (
        <Card className="bg-neutral-50/30 border border-neutral-100 rounded-3xl shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="border-b border-neutral-50 bg-neutral-50/50 p-6">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-900">
              {editingAddressId
                ? "Edit Address Details"
                : "Add New Address Details"}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-neutral-400">
              Please enter accurate delivery and contact address information.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Street Address
                </Label>
                <Input
                  type="text"
                  placeholder="Apartment, suite, unit, building, street, etc."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="rounded-xl border-neutral-200 text-xs font-semibold py-5 px-4 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    City
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="rounded-xl border-neutral-200 text-xs font-semibold py-5 px-4 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    State / Province
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="rounded-xl border-neutral-200 text-xs font-semibold py-5 px-4 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Postal / Zip Code
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter postal code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="rounded-xl border-neutral-200 text-xs font-semibold py-5 px-4 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Country
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="rounded-xl border-neutral-200 text-xs font-semibold py-5 px-4 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <Label
                  htmlFor="is-default"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-600 cursor-pointer"
                >
                  Set as default delivery address
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-neutral-200 text-neutral-600 font-extrabold text-xs uppercase tracking-wider rounded-xl py-5 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl py-5 px-6 shadow-sm transition-all duration-200 flex items-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Address Grid List */}
      {addresses.length === 0 ? (
        <Card className="border border-dashed border-neutral-200 rounded-3xl p-12 text-center bg-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 border border-neutral-100 mb-4">
            <MapPin className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
            No Addresses Found
          </h4>
          <p className="text-xs font-semibold text-neutral-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
            You don&apos;t have any saved addresses. Add an address for faster
            checkout.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address) => {
            const isDeleting = deletingId === address.id;

            return (
              <Card
                key={address.id}
                className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.015)] ${
                  address.isDefault
                    ? "border-blue-600/30 ring-1 ring-blue-600/10"
                    : "border-neutral-100 hover:border-neutral-200"
                }`}
              >
                <CardHeader className="p-5 pb-3 border-b border-neutral-50 bg-neutral-50/20">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                      {address.isDefault ? (
                        <Home className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Globe className="h-4 w-4 text-neutral-400" />
                      )}
                      Delivery Address
                    </span>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase rounded-full border border-blue-100 shadow-sm">
                        <Sparkles className="h-2.5 w-2.5" />
                        Default
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div className="text-xs font-semibold text-neutral-600 space-y-1 leading-relaxed">
                    <p className="font-extrabold text-neutral-900">
                      {address.street}
                    </p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="uppercase text-neutral-400 tracking-wider text-[10px] font-bold">
                      {address.country}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-50">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(address)}
                        className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all"
                        title="Edit address"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(address.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all"
                        title="Delete address"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>

                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address)}
                        className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl px-2.5 h-8 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Set Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
