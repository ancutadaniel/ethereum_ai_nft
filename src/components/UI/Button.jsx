import classes from "./Button.module.css";

const Button = ({ children, textOnly, className = "", ...props }) => {
  let cssClasses = textOnly ? classes["text-button"] : classes["button"];

  cssClasses += ` ${className}`;

  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
