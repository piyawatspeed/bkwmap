let iframe = document.querySelector('iframe')

let transforms = [[0.3541570007801056,0,-0.9351860284805298,0,0.027690572664141655,0.999561607837677,0.01048648077994585,0,0.9347759485244751,-0.029609695076942444,0.3540017008781433,0,2.287477970123291,1.1451492309570312,1.2842024564743042,1],[0.6412413716316223,0,-0.7673392295837402,0,-0.291083425283432,0.9252568483352661,-0.2432492971420288,0,0.7099858522415161,0.3793412446975708,0.5933129787445068,0,1.2500770092010498,0.6959248185157776,1.1420931816101074,1],[0.749516487121582,0,-0.6619857549667358,0,-0.06343931704759598,0.9953976273536682,-0.07182754576206207,0,0.6589389443397522,0.09583184123039246,0.7460668683052063,0,3.252533197402954,0.8985317945480347,3.795732021331787,1]];


async function getCameraTransform(iframe) {
	return new Promise((resolve, reject) => {
		// listen for next RESPONSE:getCameraTransform
		window.addEventListener('message', function (event) {
			try {
				let obj = JSON.parse(event.data);
				if (obj.type === 'RESPONSE:getCameraTransform') {
					resolve(obj.transform);
				}
			} catch (e) {
				reject(e);
			}
		}, { once: true });
		iframe.contentWindow.postMessage('{"type": "getCameraTransform"}', '*');
	});
}

function animateCameraTransform(iframe, transform, halfLife_s) {
	let message = {
		type: 'animateCameraTransform',
		transform,
		halfLife_s
	}
	iframe.contentWindow.postMessage(JSON.stringify(message), '*');
}

async function saveTransform() {
  let transform = await getCameraTransform(iframe);
  console.log(transform)
  transforms.push(transform)
  updateButtons()
}

function updateButtons() {
  let parent = document.querySelector('#positions');
  parent.innerHTML = '';
  for (let i = 0; i < transforms.length; i++) {
    let link = document.createElement('a');
    link.innerHTML = 'Position ' + i;
    link.href = 'javascript: void 0';
    link.onclick = () => {
      animateCameraTransform(iframe, transforms[i], 0.2);
    }
    parent.appendChild(link);
  }
  // add save button
  let save = document.createElement('a');
  save.innerHTML = '<b>+</b>';
  save.href = 'javascript: void 0';
  save.onclick = () => {
    saveTransform();
  }
  parent.appendChild(save);
}

updateButtons()