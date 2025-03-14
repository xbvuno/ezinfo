import "./Splash.css";
import { useEffect, useRef } from "react";

function Splash() {
	const splashRef = useRef(null);
	const coordVideoRef = useRef();
	const camVideoRef = useRef();

	useEffect(() => {
		let timer_video_pause = null;
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const CLS_NAME = "dimn";

			if (!splashRef.current) return;

			const splash_cls = splashRef.current.classList

			if (scrollY > 80) {
				if (!splash_cls.contains(CLS_NAME)) {
					splash_cls.add(CLS_NAME);
					
					timer_video_pause = setTimeout(() => {
						for (const video of [coordVideoRef, camVideoRef]) {
							if (video.current && !video.current.paused) {
								video.current.pause();
							}
						}
					}, 2000)
					
				}
			}

			if (scrollY <= 80 && splash_cls.contains(CLS_NAME)) {
				splash_cls.remove(CLS_NAME);
				if (timer_video_pause) clearTimeout(timer_video_pause)
				for (const video of [coordVideoRef, camVideoRef]) {
					if (video.current && video.current.paused) {
						video.current.currentTime = 0;
						video.current.play();
					}
				}

			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div id="splash" ref={splashRef} style={{'--wp-url': `url("wallpaper.jpg")`}}>
			<img src="wallpaper.jpg" className="wp"/>
			<video
				className="coord"
				autoPlay={true}
				loop={true}
				muted={true}
				ref={coordVideoRef}
			>
				<source src="player_pov.webm" type="video/webm" />
				Il tuo browser non supporta i video con trasparenza.
			</video>
			<hgroup>
				<p></p>
				<h1>ezLite</h1>
				<p>A DATAPACK BY BVUNO</p>
			</hgroup>
			<video
				className="cam"
				autoPlay={true}
				loop={true}
				muted={true}
				ref={camVideoRef}
			>
				<source src="cam_pov.webm" type="video/webm" />
				Il tuo browser non supporta i video con trasparenza.
			</video>
		</div>
	);
}

export default Splash;
