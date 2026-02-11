"use client";

import React from "react";
import { signup, login } from "@/actions/auth";
import { useActionState } from "react";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [state, action, pending] = useActionState(type === "login" ? login : signup, undefined);

  return (
    <form className="w-full max-w-md p-8 bg-background rounded shadow text-primary border-border border -mt-20" action={action}>
      <h2 className="text-2xl font-bold mb-6">{type === "login" ? "Login" : "Register"}</h2>
      {type === "register" && (
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:ring-primary/50"
        />
      </div>
      )}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:ring-primary/50"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:ring-primary/50"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`w-full py-2 px-4 bg-primary text-white font-semibold rounded hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary/50 ${
          pending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {pending ? "Processing..." : type === "login" ? "Login" : "Register"}
      </button>
    </form>
  )
}

export default AuthForm;

