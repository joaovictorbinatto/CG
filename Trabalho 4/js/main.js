var camera, scene, renderer, controls;
var mtlLoader, objLoader;
var mario, luigi, cascos, clouds;
var pontosReta = new THREE.Geometry();
var pontosSalto = new THREE.Geometry();
var count = 0;

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

			mariomovimento();
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
			}
		}
	});
	
	
	
	

    window.addEventListener('resize', onWindowResize, false);
}

function mariofrente() {
	if(count == 20)
			return;

	mario.position.x = pontosReta.vertices[count].x;
	mario.position.y = pontosReta.vertices[count].y;
	mario.position.z = pontosReta.vertices[count].z;

	count++;
}

function mariomovimento() {
	
	// anda um passo toda vez que a seta pra direita é pressionada
	$(document).keydown(function(e){

		if (e.which == 39) {
			criaCurva("reta");
			mariofrente();
		}
	});
	
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

	
	controls.update();

	render();

}

function criaCurva(opc) {
	
	if(opc == "reta") {
		var reta = new THREE.QuadraticBezierCurve3(
			new THREE.Vector3(mario.position.x, -35, 0),
			new THREE.Vector3(mario.position.x/2, -35, 0),
			new THREE.Vector3(30, -35, 0)
		);
		
		pontosReta.vertices = reta.getPoints(20);
	}

}

function render() {

	camera.lookAt(scene.position);
	renderer.render(scene, camera);

}
