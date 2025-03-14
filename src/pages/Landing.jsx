import { Link } from "react-router-dom";
function Landing() {
	return (
			<section className='genbutn'>
				<p>What are you waiting?</p>
				<Link to='/gen'>
					<button>Open the Generator!</button>
				</Link>
			</section>
	);
}

export default Landing;
