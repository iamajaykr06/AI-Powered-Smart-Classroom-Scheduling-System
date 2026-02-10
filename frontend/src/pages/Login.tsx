import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../layouts/AuthLayout";
import { loginSchema, type LoginFormData } from "../types/auth";
import "../styles/auth.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("VALID DATA:", data);
    // next step: send to backend
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button
          text={isSubmitting ? "Logging in..." : "Login"}
          type="submit"
          disabled={isSubmitting}
        />
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
