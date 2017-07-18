var camera, scene, renderer, controls;
var mtlLoader, objLoader;
//var rings, sonic, clouds, sun;
var mario, luigi, cascos, clouds;

init();
animate();

function init() {
    
    camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 100;
    camera.position.z = 500;
	
    scene = new THREE.Scene();
	cascos = new Array();
	clouds = new Array();
	
	renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
	// adiciona luz ambiente	
	var ambientLight = new THREE.AmbientLight(0x404040, 4.8);
	scene.add(ambientLight);
	
	// faz a camera mexer
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	
	// so permite mexer a camera horizontalmente
	controls.minPolarAngle = Math.PI/2;
	controls.maxPolarAngle = 0;	
	controls.minAzimuthAngle = - Infinity;
	controls.maxAzimuthAngle = Infinity;
	
	

	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/mario/');
	mtlLoader.load('mario_obj.mtl', function(materials) {

		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/mario/');
		objLoader.load('mario_obj.obj', function (object) {
			mario = object;
        	mario.scale.set( 0.25, 0.25, 0.25 );
        	mario.rotateY(Math.PI/1.6);
        	mario.position.set(-50, -35, 0);
			
			scene.add(object);
		});
	});
	
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/mario/');
	mtlLoader.load('Luigi_obj.mtl', function(materials) {

		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/mario/');
		objLoader.load('Luigi_obj.obj', function (object) {
			luigi = object;
        	luigi.scale.set( 0.25, 0.25, 0.25 );
        	luigi.rotateY(Math.PI/1.6);
        	luigi.position.set(-50, -35, 10);
			
			scene.add(object);
		});
	});

	// carrega os cascos
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/casco/');
	mtlLoader.load('Blue Shell.mtl', function(materials) {
		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/casco/');	

		for (var i = 0; i < 3; i++) {
			switch (i) {
				case 0:
					objLoader.load('Blue Shell.obj', function (object) {
						cascos[0] = object;
						cascos[0].scale.set(0.1, 0.1, 0.1);
						cascos[0].rotateX(Math.PI/2);
						cascos[0].position.set(35, -16, 0);
						scene.add(cascos[0]);
					});	
					break;
				case 1:
					objLoader.load('Blue Shell.obj', function (object) {
						cascos[1] = object;
						cascos[1].scale.set(0.1, 0.1, 0.1);
						cascos[1].rotateX(Math.PI/2);
						cascos[1].position.set(50, -16, 0);
						scene.add(cascos[1]);
					});
					break;
				case 2:
					objLoader.load('Blue Shell.obj', function (object) {
						cascos[2] = object;
						cascos[2].scale.set(0.1, 0.1, 0.1);
						cascos[2].rotateX(Math.PI/2);
						cascos[2].position.set(65, -16, 0);
						scene.add(cascos[2]);
					});
					break;
			}
		}
	});
	
	// carrega as nuvens
	mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('obj/cloud/');
	mtlLoader.load('island-cloud.mtl', function(materials) {

		materials.preload();

		objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('obj/cloud/');
		for (var i = 0; i < 2; i++) {
			switch(i) {
				case 0:
					objLoader.load('island-cloud.obj', function (object) {
						clouds[0] = object;
						clouds[0].scale.set(0.1, 0.1, 0.1);
						clouds[0].rotateX(Math.PI/2);
						clouds[0].position.set(50, 25, -20);
						scene.add(clouds[0]); 
					});
					break;
				case 1:
					objLoader.load('island-cloud.obj', function (object) {
						clouds[1] = object;
						clouds[1].scale.set(0.1, 0.1, 0.1);
						clouds[1].rotateX(Math.PI/2);
						clouds[1].position.set(-50, 25, -20);
						scene.add(clouds[1]);
					});
					break;
			}
		}
	});
	
	// carrega e aplica a texture do sol
	var textureLoader = new THREE.TextureLoader();
	
	uniforms = {

		fogDensity: { value: 0.0001 },
		fogColor:   { value: new THREE.Vector3(255, 203, 31) },
		time:       { value: 1.0 },
		uvScale:    { value: new THREE.Vector2(3.0, 1.0) },
		texture1:   { value: textureLoader.load("texture/lava/cloud.png") },
		texture2:   { value: textureLoader.load("texture/lava/lavatile.jpg") }

	};

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;
	
	// carrega o shader do sol
	var sunMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	});
	
	// cria o sol e aplica o shader
	sun = new THREE.Mesh( new THREE.SphereGeometry(4, 32, 32), sunMaterial );
	sun.rotation.x = 0;
	sun.position.set(0, 30, -50);
	scene.add(sun);

    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);
	
	// faz os aneis girarem
	for (var i = 0; i < cascos.length; i++) {
		cascos[i].rotation.z += 0.05;
	}
	
	// faz o sol girar
	sun.rotation.y += 0.01;
	
	controls.update();

	render();

}

function render() {

	camera.lookAt(scene.position);
	renderer.render(scene, camera);

}
