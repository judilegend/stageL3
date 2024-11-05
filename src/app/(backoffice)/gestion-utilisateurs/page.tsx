"use client";

import UserManagementTable from "@/components/gestion-utilisateurs/UserManagementTable";
import { useUsers } from "@/contexts/UserContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { userService } from "@/services/userService";

export default function GestionUtilisateursPage() {
  const { state, dispatch } = useUsers();

  useEffect(() => {
    const initializeUsers = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const users = await userService.getAllUsers();
        dispatch({ type: "SET_USERS", payload: users });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Erreur lors du chargement des utilisateurs",
        });
      }
    };

    initializeUsers();
  }, [dispatch]);

  if (state.loading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="w-full p-4">
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 lg:py-8">
      <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <UserManagementTable />
        </div>
      </div>
    </div>
  );
}
