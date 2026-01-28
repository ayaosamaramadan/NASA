import { Link } from "react-router";
import theSonga from "/sfx.mp3";
import useSound from "use-sound";

const SquBtn = ({ link, ICONclassName, HoverclassName, hoverText, Icon: Icon }: any) => {
    const [play, { stop }] = useSound(theSonga);
    //   console.log(thesonga);

    return (
        <Link to={`/${link}`}>
            <div className="relative cursor-none"></div>
            <button
                // onMouseEnter={() => play()} onMouseLeave={() => stop()}    

                className={`${ICONclassName} cursor-none`}

                onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '1';
                    play();
                }}
                onMouseLeave={(e) => {
                    stop();
                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '0';
                }}
            >
                <Icon className='cursor-none rotate-[-46deg]' />
            </button>
            <div className={HoverclassName}>
                {hoverText}
            </div>
        </Link>
    );
}

export default SquBtn;