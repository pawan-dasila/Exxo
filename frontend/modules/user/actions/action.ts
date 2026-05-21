"use server";

import { cookies } from "next/headers";
import { UserWithProfile, Address, AddressRequest } from "../types";
import { revalidatePath } from "next/cache";

const BACKEND_URL = "http://localhost:8000";

// Fetch current user profile
export async function getCurrentUserWithProfileAction(): Promise<UserWithProfile | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) return null;

  try {
    const response = await fetch(`${BACKEND_URL}/user/profile`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) return null;

    const result = await response.json();
    const user = result.data;

    if (!user) return null;

    return {
      ...user,
      full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
    };
  } catch (error) {
    console.error("Failed to fetch current user in server action:", error);
    return null;
  }
}

// Update profile action
export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${BACKEND_URL}/user/profile`, {
      method: "PATCH",
      headers: {
        Cookie: cookieHeader,
      },
      body: formData, // FormData matches upload.single("profileImage") + other fields
    });

    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || "Failed to update profile" };
    }

    revalidatePath("/accounts");
    return { data: result.data };
  } catch (error) {
    console.error("Error in updateProfileAction:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Fetch addresses action
export async function getAddressesAction(): Promise<{ data: Address[] | null; error?: string }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) return { data: null };

  try {
    const response = await fetch(`${BACKEND_URL}/user/addresses`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return { data: null, error: "Failed to fetch addresses" };
    }

    const result = await response.json();
    return { data: result.data || [] };
  } catch (error) {
    console.error("Failed to fetch addresses in server action:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}

// Add address action
export async function addAddressAction(data: AddressRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${BACKEND_URL}/user/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || "Failed to add address" };
    }

    revalidatePath("/accounts");
    return { data: result.data };
  } catch (error) {
    console.error("Error in addAddressAction:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Update address action
export async function updateAddressAction(id: string, data: Partial<AddressRequest>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${BACKEND_URL}/user/addresses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || "Failed to update address" };
    }

    revalidatePath("/accounts");
    return { data: result.data };
  } catch (error) {
    console.error("Error in updateAddressAction:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Delete address action
export async function deleteAddressAction(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${BACKEND_URL}/user/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      return { error: result.message || "Failed to delete address" };
    }

    revalidatePath("/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAddressAction:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getCurrentUser() {
  return getCurrentUserWithProfileAction();
}
