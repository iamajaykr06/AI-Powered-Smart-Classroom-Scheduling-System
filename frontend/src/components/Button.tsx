interface ButtonProps {
    text: string;
    type?: "button" | "submit";
    disabled?: boolean;
}

const Button = ({ text, type = "button", disabled }: ButtonProps) => {
    return (
        <button type={type} disabled={disabled}>
            {text}
        </button>
    );
};

export default Button;
