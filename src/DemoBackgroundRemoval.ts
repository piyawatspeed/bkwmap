import { LumaSplatsSemantics, LumaSplatsThree } from "@lumaai/luma-web";
import { DemoProps } from ".";
import { loadEnvironment } from "./util/Environment";

export function DemoBackgroundRemoval(props: DemoProps) {
	let { renderer, scene, gui } = props;

	let splats = new LumaSplatsThree({
		// Jules Desbois La Femme à l’arc @HouseofJJD
		source: 'https://lumalabs.ai/capture/1b5f3e33-3900-4398-8795-b585ae13fd2d',
		enableThreeShaderIntegration: false,
	});

	scene.add(splats);
	
	let layersEnabled = {
		Background: false,
		Foreground: true,
	}

	function updateSemanticMask() {
		splats.semanticsMask =
			(layersEnabled.Background ? LumaSplatsSemantics.BACKGROUND : 0) |
			(layersEnabled.Foreground ? LumaSplatsSemantics.FOREGROUND : 0);
	}

	updateSemanticMask();

	gui.add(layersEnabled, 'Background').onChange(updateSemanticMask);

	loadEnvironment(renderer, scene, 'assets/venice_sunset_1k.hdr');

	return {
		dispose: () => {
			splats.dispose();
		}
	}
}