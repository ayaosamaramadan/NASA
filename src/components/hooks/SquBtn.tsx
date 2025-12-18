
import { Link } from "react-router";

const SquBtn = ({link, ICONclassName,HoverclassName ,hoverText , Icon: Icon}:any ) => {
    return (
    <Link to={`/${link}`}>
        <div className="relative"></div>
        <button
            className={ICONclassName}
            onMouseEnter={(e) => {
                const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                if (tooltip) tooltip.style.opacity = '0';
            }}
        >
            <Icon className='rotate-[-46deg]' />
        </button>
        <div className={HoverclassName}>
           {hoverText}
        </div>
    </Link>
    );
}

export default SquBtn;