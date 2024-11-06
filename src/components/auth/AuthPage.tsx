"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, UserPlus, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "../ui/loading-spinner";

interface AuthFormData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe: boolean;
}

interface AuthPageProps {
  type: "login" | "register";
}

export default function AuthPage({ type }: AuthPageProps) {
  const { login, register, error: authError } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    if (type === "register" && !formData.username) {
      setError("Le nom d'utilisateur est requis");
      return false;
    }
    if (!formData.email) {
      setError("L'email est requis");
      return false;
    }
    if (!formData.password) {
      setError("Le mot de passe est requis");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Veuillez entrer un email valide");
      return false;
    }
    if (type === "register" && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;

      if (type === "login") {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(
          formData.username!,
          formData.email,
          formData.password
        );
      }

      if (response.success) {
        setTimeout(async () => {
          await router.push("/dashboard");
          setIsLoading(false);
        }, 1500);
      } else {
        setError(
          response.error || "Une erreur est survenue lors de l'authentification"
        );
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-10 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl">
            <Image
              src="https://illustrations.popsy.co/white/product-launch.svg"
              alt="Collaboration d'équipe"
              width={500}
              height={500}
              className="w-full transform hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="text-center backdrop-blur-sm rounded-xl mt-4">
              <h2 className="text-3xl font-bold text-black">
                Plateforme de Gestion DepannPC
              </h2>
              <p className="mt-4 text-gray-600 text-lg font-semibold leading-relaxed">
                Collaborez efficacement avec votre équipe de développement dans
                un environnement intuitif et professionnel.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <Image
                src="/depannPc.jpg"
                alt="DepannPC Logo"
                width={150}
                height={50}
                className="mx-auto"
                priority
              />
              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                {type === "login" ? "Bienvenue" : "Inscription"}
              </h1>
              <p className="mt-2 text-gray-600">
                {type === "login"
                  ? "Accédez à votre espace de développement"
                  : "Créez un compte pour accéder à la plateforme"}
              </p>
            </div>

            {(error || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
              >
                <p className="text-red-700 text-sm font-medium">
                  {error || authError}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                {type === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white/60 backdrop-blur-sm transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white/60 backdrop-blur-sm transition-all duration-200"
                      placeholder="prenom.nom@depannpc.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white/60 backdrop-blur-sm transition-all duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {type === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white/60 backdrop-blur-sm transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              {type === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Se souvenir de moi
                    </span>
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {type === "login"
                      ? "Connexion en cours..."
                      : "Inscription en cours..."}
                  </>
                ) : (
                  <>
                    {type === "login" ? "Se connecter" : "S'inscrire"}
                    {type === "login" ? (
                      <ArrowRight className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5" />
                    )}
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-600">
              {type === "login"
                ? "Nouveau sur la plateforme ?"
                : "Vous avez déjà un compte ?"}{" "}
              <Link
                href={type === "login" ? "/register" : "/login"}
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                {type === "login" ? "Créer un compte" : "Se connecter"}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
