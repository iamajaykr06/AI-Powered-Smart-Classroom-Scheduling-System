import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-container">
            <div className="auth-card">{children}</div>
        </div>
    );
};

export default AuthLayout;
