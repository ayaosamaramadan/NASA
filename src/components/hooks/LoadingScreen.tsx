import "../../styles/loading.css"

const LoadingScreen = () => {
    return (
        <div className="loading-overlay">
            <ul className="loading-dots">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    )
}

export default LoadingScreen