var camera, scene, renderer;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 100;
    camera.position.z = 600;
	
    scene = new THREE.Scene();
    
	// luz pra fazer o dado aparecer
	var luz = new THREE.DirectionalLight(0xffffff);
	luz.position.set(0, 1, 1);
	scene.add(luz);

	// carrega o modelo
	var loader = new THREE.OBJLoader();
	loader.load('obj/Sword.obj', function (object) {
		scene.add(object);

	});
        
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

	camera.lookAt(scene.position);
	renderer.render(scene, camera);

}
