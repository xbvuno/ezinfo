import React, { useReducer, useState, useEffect, useRef } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import "./Generator.css";
import JSZip from "jszip";

// Nuovo stato come array di soli valori
const directionInitialState = ["Z-", "X+", "Z+", "X-"]; // [n, e, s, w]
const cardinalsInitialState = ["North", "East", "South", "West"]; // [n, e, s, w]

// Funzione del reducer
const reducer = (state, action) => {
	const newState = [...state];
	newState[action.index] = action.value; // Modifica l'elemento all'indice specificato
	return newState;
};

function Generator() {
	const previewRef = useRef(null);

	const [primary_color, setPrimaryColor] = useColor("#dfbe26");
	const [secondary_color, setSecondaryColor] = useColor("#d1bfd9");

	// Usa useReducer con gli array per directionState e cardinalsState
	const [directionState, dispatchDirection] = useReducer(
		reducer,
		directionInitialState
	);
	const [cardinalsState, dispatchCardinals] = useReducer(
		reducer,
		cardinalsInitialState
	);

	const [previewState, setPreviewState] = useState(<>Ciao</>);
	const [loading, setLoading] = useState(false);

	const [isDirectionEnabled, setDirectionEnabled] = useState(true);
	const [isCardinalsEnabled, setCardinalsEnabled] = useState(true);

	// Nuove coordinate di Minecraft in tempo reale
	const [coordinates, setCoordinates] = useState({ x: 9, y: 42, z: -132 });
	const [currentDirection, setCurrentDirection] = useState(0); // Indice per la direzione

	// Funzione per ricaricare il preview
	const ReloadPreview = () => {
		if (!previewRef.current) return;

		let result = [];

		previewRef.current.style.setProperty("--p-color", primary_color.hex);
		previewRef.current.style.setProperty("--s-color", secondary_color.hex);

		if (isDirectionEnabled) {
			result.push(
				<p className='secondary' key='d'>
					{directionState[currentDirection]}{" "}
				</p>
			);
			result.push(
				<p className='primary' key='s1'>
					|{" "}
				</p>
			);
		}
		result.push(
			<p className='secondary' key='xv'>
				{coordinates.x}
			</p>
		);
		result.push(
			<p className='primary' key='xs'>
				x{" "}
			</p>
		);
		result.push(
			<p className='secondary' key='yv'>
				{coordinates.y}
			</p>
		);
		result.push(
			<p className='primary' key='ys'>
				y{" "}
			</p>
		);
		result.push(
			<p className='secondary' key='zw'>
				{coordinates.z}
			</p>
		);
		result.push(
			<p className='primary' key='zs'>
				z
			</p>
		);
		if (isCardinalsEnabled) {
			result.push(
				<p className='primary' key='s2'>
					{" "}
					|{" "}
				</p>
			);
			result.push(
				<p className='secondary' key='c'>
					{cardinalsState[currentDirection]}{" "}
				</p>
			);
		}

		setPreviewState(result);
	};

	const renderPreview = () => {
		return previewState;
	};

	// Funzione per cambiare direzione ciclicamente
	const cycleDirection = () => {
		setCurrentDirection((prevDirection) => (prevDirection + 1) % 4); // Cicla tra 0, 1, 2, 3
	};

	// Funzione per aggiornare le coordinate con logica asincrona
	const updateCoordinates = () => {
		setCoordinates((prevCoordinates) => {
			let newCoordinates = { ...prevCoordinates };

			// Ogni tanto incrementa e ogni tanto decrementa (asincrono)
			const randomDirectionX = Math.random() > 0.5 ? 1 : -1; // 50% di probabilità per incrementare o decrementare
			const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
			const randomDirectionZ = Math.random() > 0.5 ? 1 : -1;

			// Aumenta o diminuisce in modo asincrono
			newCoordinates.x = Math.min(
				Math.max(newCoordinates.x + randomDirectionX, 0),
				15
			); // Assicura che x sia tra 0 e 15
			newCoordinates.y = Math.min(
				Math.max(newCoordinates.y + randomDirectionY, 0),
				50
			); // Assicura che y sia tra 0 e 50
			newCoordinates.z = Math.min(
				Math.max(newCoordinates.z + randomDirectionZ, -150),
				0
			); // Assicura che z sia tra -150 e 0

			return newCoordinates;
		});
	};

	// useEffect per monitorare i cambiamenti negli stati
	useEffect(() => {
		ReloadPreview();
	}, [
		directionState,
		cardinalsState,
		primary_color,
		secondary_color,
		isDirectionEnabled,
		isCardinalsEnabled,
		coordinates,
		currentDirection,
	]);

	// useEffect per gestire l'aggiornamento asincrono delle coordinate e della direzione
	useEffect(() => {
		const interval = setInterval(() => {
			updateCoordinates(); // Cambia le coordinate in modo asincrono
			cycleDirection(); // Cambia la direzione
		}, 1000 + Math.floor(Math.random() * 2000)); // Ogni 1-3 secondi

		return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
	}, []);

	const handleChange = (dispatch, index) => (event) => {
		dispatch({ index, value: event.target.value });
	};

	const generateDataPack = async () => {
		function makeid(length) {
			let result = "";
			const characters = "abcdefghijklmnopqrstuvwxyz";
			const charactersLength = characters.length;
			let counter = 0;
			while (counter < length) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
				counter += 1;
			}
			return result;
		}

		setLoading(true); // Imposta lo stato per mostrare un caricamento durante la generazione del file

		const zip = new JSZip();

		// Crea la struttura delle cartelle
		const dataDir = zip.folder("data/minecraft/tags/function");
		const functionsDir = zip.folder("data/ezlite/function");

		// Aggiungi l'immagine al datapack
		const imageFile = await fetch("datapack_img.png"); // Assicurati che l'immagine sia nel percorso giusto
		const imageBlob = await imageFile.blob();
		zip.file("pack.png", imageBlob); // Aggiungi l'immagine nella cartella appropriata

		// Aggiungi i file JSON per load e tick
		dataDir.file(
			"load.json",
			JSON.stringify({
				values: ["ezlite:load"],
			})
		);

		dataDir.file(
			"tick.json",
			JSON.stringify({
				values: ["ezlite:tick"],
			})
		);

		// Aggiungi i file .mcfunction per load e tick
		functionsDir.file(
			"load.mcfunction",
			`scoreboard objectives add ei.pos.x dummy
scoreboard objectives add ei.pos.z dummy
scoreboard objectives add ei.pos.y dummy
schedule function ezlite:welcome 1s append
`
		);

		const tick_text = `
				execute as @a store result score @s ei.pos.x run data get entity @s Pos[0]
execute as @a store result score @s ei.pos.y run data get entity @s Pos[1]
execute as @a store result score @s ei.pos.z run data get entity @s Pos[2]
`;

		const basic_coords = `{"score":{"name":"@s","objective":"ei.pos.x"},"color":"${secondary_color.hex}"},{"text":"x ","color":"${primary_color.hex}"},{"score":{"name":"@s","objective":"ei.pos.y"},"color":"${secondary_color.hex}"},{"text":"y ","color":"${primary_color.hex}"},{"score":{"name":"@s","objective":"ei.pos.z"},"color":"${secondary_color.hex}"},{"text":"z","color":"${primary_color.hex}"}`;

		const basic_compass = [
			"#north-\nexecute as @a[y_rotation=-180..-136] run title @s actionbar [",
			"#north+\nexecute as @a[y_rotation=137..180] run title @s actionbar [",
			"#east\nexecute as @a[y_rotation=-135..-45] run title @s actionbar [",
			"#south\nexecute as @a[y_rotation=-44..45] run title @s actionbar [",
			"#west\nexecute as @a[y_rotation=46..136] run title @s actionbar [",
		];

		const direction_texts = [
			`{"text":"${directionState[0]}","color":"${secondary_color.hex}"},{"text":" | ","color":"${primary_color.hex}"},`,
			`{"text":"${directionState[0]}","color":"${secondary_color.hex}"},{"text":" | ","color":"${primary_color.hex}"},`,
			`{"text":"${directionState[1]}","color":"${secondary_color.hex}"},{"text":" | ","color":"${primary_color.hex}"},`,
			`{"text":"${directionState[2]}","color":"${secondary_color.hex}"},{"text":" | ","color":"${primary_color.hex}"},`,
			`{"text":"${directionState[3]}","color":"${secondary_color.hex}"},{"text":" | ","color":"${primary_color.hex}"},`,
		];

		const cardinal_text = [
			`,{"text":" | ","color":"${primary_color.hex}"},{"text":"${cardinalsState[0]}","color":"${secondary_color.hex}"}`,
			`,{"text":" | ","color":"${primary_color.hex}"},{"text":"${cardinalsState[0]}","color":"${secondary_color.hex}"}`,
			`,{"text":" | ","color":"${primary_color.hex}"},{"text":"${cardinalsState[1]}","color":"${secondary_color.hex}"}`,
			`,{"text":" | ","color":"${primary_color.hex}"},{"text":"${cardinalsState[2]}","color":"${secondary_color.hex}"}`,
			`,{"text":" | ","color":"${primary_color.hex}"},{"text":"${cardinalsState[3]}","color":"${secondary_color.hex}"}`,
		];

		let elaborate_command = "";

		if (isDirectionEnabled || isCardinalsEnabled) {
			if (isDirectionEnabled && isCardinalsEnabled) {
				for (let i = 0; i < 5; i++) {
					elaborate_command +=
						basic_compass[i] +
						direction_texts[i] +
						basic_coords +
						cardinal_text[i] +
						"]\n";
				}
			} else {
				if (isDirectionEnabled) {
					for (let i = 0; i < 5; i++) {
						elaborate_command +=
							basic_compass[i] +
							direction_texts[i] +
							basic_coords +
							"]\n";
					}
				} else {
					for (let i = 0; i < 5; i++) {
						elaborate_command +=
							basic_compass[i] +
							basic_coords +
							cardinal_text[i] +
							"]\n";
					}
				}
			}
		} else {
			elaborate_command =
				"execute as @a run title @s actionbar [" + basic_coords + "]\n";
		}
		functionsDir.file("tick.mcfunction", tick_text + elaborate_command);

		functionsDir.file(
			"welcome.mcfunction",
			`tellraw @a ["",{"text":"[","color":"dark_gray"},{"text":"EzLiteCustom 1.0","color":"green"},{"text":"] ","color":"dark_gray"},{"text":"by ","color":"white"},{"text":"bvuno","underlined":true,"color":"gold","clickEvent":{"action":"open_url","value":"https://www.planetminecraft.com/member/bvuno/"}}]`
		);

		// Aggiungi il pack.mcmeta
		zip.file(
			"pack.mcmeta",
			JSON.stringify({
				pack: {
					pack_format: 57,
					description: [
						{ text: "[", color: "dark_gray" },
						{
							text: "ezLite",
							color: "light_purple",
							clickEvent: {
								action: "open_url",
								value: "https://www.planetminecraft.com/member/bvuno/",
							},
						},
						{ text: "]", color: "dark_gray" },
						{ text: " by", color: "white" },
						{ text: " ", color: "green" },
						{
							text: "bvuno",
							underlined: true,
							color: "gold",
							clickEvent: {
								action: "open_url",
								value: "mine.ly/bvuno",
							},
						},
						{ text: "!", color: "white" },
					],
				},
			})
		);

		// Crea il file .zip e avvia il download
		const content = await zip.generateAsync({ type: "blob" });

		// Crea un link per il download e avvia il download immediatamente
		const link = document.createElement("a");
		link.href = URL.createObjectURL(content);
		link.download = "ezInfoCustom 1.0 [" + makeid(8) + "].zip";
		document.body.appendChild(link); // Appendere il link al body
		link.click(); // Cliccare sul link per avviare il download
		document.body.removeChild(link); // Rimuovere il link dal DOM dopo il download

		setTimeout(() => setLoading(false), 1000); // Imposta lo stato a false quando il download è completato
	};

	return (
		<>
			<main id='gen' className='container'>
				<section>
					<hgroup>
						<p></p>
						<h1>Let's start!</h1>
						<p>Create your own personalized datapack</p>
					</hgroup>
					<ul className='grid'>
						<li>
							<strong>Real-Time Preview:</strong> See changes
							instantly as you customize, giving you a clear view
							of how your settings will look in-game.
						</li>
						<li>
							<strong>Color Selection:</strong> Choose a color for
							primary and secondary
						</li>
						<li>
							<strong>Compass Styles:</strong> Select from
							different compass designs or edit it word by word
						</li>
						<li>
							<strong>Advanced Settings:</strong> You can directly
							edit the text via JSON in the advanced settings.
							(WORK IN PROGRESS)
						</li>
					</ul>
					<p>Once you're done, simply download your datapack!</p>
				</section>
				<section className='grid colorfields'>
					<hgroup>
						<p></p>
						<h1>Colors</h1>
						<ul>
							<li>
								<strong>Primary:</strong> The variable values in
								the display
							</li>
							<li>
								<strong>Secondary:</strong> The characters that
								doesn't change
							</li>
						</ul>
					</hgroup>

					<div>
						<label>
							<h3>Primary</h3>
						</label>
						<ColorPicker
							hideAlpha
							hideInput={["rgb", "hsv"]}
							color={primary_color}
							onChange={setPrimaryColor}
						/>
					</div>
					<div>
						<label>
							<h3>Secondary</h3>
						</label>
						<ColorPicker
							hideAlpha
							hideInput={["rgb", "hsv"]}
							color={secondary_color}
							onChange={setSecondaryColor}
						/>
					</div>
				</section>
				<section className='compass-settings'>
					<hgroup>
						<p></p>
						<h1>Compass Settings</h1>
						<ul>
							<li>
								<strong>Direction:</strong> which coordinate
								would be affected by moving that direction and
								how (ex. Z+, X-)
							</li>
							<li>
								<strong>Cardinals:</strong> The cardinal points
								displayed.
							</li>
						</ul>
						Disable both to hide the compass and the separation
						marks
					</hgroup>
					<h3 className='label-cb'>
						<label>Direction</label>
						<input
							type='checkbox'
							checked={isDirectionEnabled}
							onChange={() =>
								setDirectionEnabled(!isDirectionEnabled)
							}
						/>
					</h3>
					<div className='grid'>
						{directionState.map((value, index) => (
							<input
								key={index}
								type='text'
								value={value}
								placeholder={directionInitialState[index]}
								onChange={handleChange(
									dispatchDirection,
									index
								)}
								disabled={!isDirectionEnabled}
							/>
						))}
					</div>
					<h3 className='label-cb'>
						<label>Cardinals</label>
						<input
							type='checkbox'
							checked={isCardinalsEnabled}
							onChange={() =>
								setCardinalsEnabled(!isCardinalsEnabled)
							}
						/>
					</h3>
					<div className='grid'>
						{cardinalsState.map((value, index) => (
							<input
								key={index}
								type='text'
								value={value}
								placeholder={cardinalsInitialState[index]}
								onChange={handleChange(
									dispatchCardinals,
									index
								)}
								disabled={!isCardinalsEnabled}
							/>
						))}
					</div>
				</section>
				<section id='preview' ref={previewRef}>
					{renderPreview()}
				</section>
				<section className='finalBTN'>
					<button
						onClick={generateDataPack}
						disabled={loading}
						aria-busy={loading}
					>
						{!loading ? "Generate and download!" : "Generating..."}
					</button>
					<p>
						For any errors or problems, report them on{" "}
						<a href='https://t.me/+UN2tgE9YyPo5ZWNk'>
							this Telegram group
						</a>
					</p>
					<p>
						or send me a message on{" "}
						<a href='https://www.planetminecraft.com/member/bvuno/'>
							PlanetMC
						</a>{" "}
						(I use it more rarely)
					</p>
					<p>
						This project is made by me (a newbie). Any help or
						advice about anything is welcome.
					</p>
					<p>All rights reserved.</p>
				</section>
			</main>
		</>
	);
}

export default Generator;
