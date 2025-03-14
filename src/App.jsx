import "./App.css";
import Splash from "./Splash";
import Generator from "./pages/Generator";

function App() {
	return (
		<>
			<Splash />
			<main id="app-body" className='container'>
				<hgroup>
					<p>FROM THE CREATOR OF EZINFO</p>
					<h1>NEVER GET LOST AGAIN!</h1>
					<p>
						Navigate Minecraft your way with a fully customizable
						experience!
					</p>
				</hgroup>
				<section className='container-fluid'>
					<p>
						This datapack shows your coordinates and direction in
						real-time, so you're always aware of your position and
						orientation. The best part? You can customize it
						directly on our website to fit your style and
						needs-choose what to display, adjust the look, and make
						it your own.
					</p>
					<strong>Features:</strong>
					<ul>
						<li>
							<strong>Live Coordinates & Direction</strong>:
							Always know your X, Y, Z position and facing
							direction.
						</li>
						<li>
							<strong>Easy Customization</strong>: Use our website
							to create your own version in just a few clicks.
						</li>
						<li>
							<strong>Quick to Download</strong>: Build your
							custom datapack from <b>your browser</b> and start
							using it immediately.
						</li>
					</ul>
					<p>
						Whether you're working on a massive build or exploring
						new biomes, this datapack offers a seamless way to stay
						oriented-made just the way you like it!
					</p>
				</section>
				<Generator />
			</main>
			<footer>
				<img src='bvuno.svg' />
			</footer>
		</>
	);
}

export default App;
