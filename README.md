# Sistema Solar Interactivo.

Este proyecto es una escena 3D hecha con Three.js que simula:

* Un sistema solar con una estrella central (el "sol").
* Varios planetas orbitando la estrella en trayectorias elípticas.
* Varias lunas orbitando distintos planetas.
* Un fondo espacial esférico con textura para simular el espacio.
* Una nave pilotable en tercera persona.

## Contenido de la escena

### Estrella

En el centro de la escena hay una esfera iluminada que actúa como sol. Además de ser visible, sirve también como fuente de luz para el resto de los objetos.

### Planetas

Se crean varios planetas alrededor del sol. Cada planeta:

* Tienen su propia textura.
* Se mueven siguiendo una órbita elíptica alrededor del sol.
* Giran ligeramente sobre sí mismo.

Las órbitas no son círculos perfectos: se pueden escalar en los ejes X e Y para parecer más reales (más tipo elipse).

### Lunas

Las lunas también están texturizadas y se mueve con su propia órbita independiente.

### Fondo espacial

La escena completa está dentro de una esfera muy grande que tiene una textura de estrellas. Esa esfera se renderiza "al revés", desde dentro, para que parezca que estás volando en el espacio.


## La nave

Además de los cuerpos astronómicos, hay una nave espacial cargada desde un modelo externo en formato `.obj` con su `.mtl` y sus texturas. Esta nave no es solo decorativa: la puedes controlar.

La nave:

* Tiene posición y orientación en el mundo.
* Puede moverse hacia adelante y hacia atrás.
* Puede girar como anakin.
* Puede inclinar el morro para cambiar la horientación y ver de cerca todos los planetas.

También existe una cámara de persecución (tercera persona) que sigue a la nave.

## Modos de cámara

Hay dos modos de vista:

1. **Vista Sistema (tecla del número 1)**
   Cámara lejana/orbital para observar el sistema solar completo.
   Esta cámara tiene OrbitControls, o sea que puedes rotar y hacer zoom con el ratón.

2. **Vista Nave (tecla del número 2)**
   Cámara tercera persona que sigue automáticamente a la nave desde atrás y un poco arriba.

Puedes alternar entre estas dos vistas en cualquier momento.

## Controles de la vista de sistema
* `click izquierdo` → cambiar el angulo del punto de vista.
* `click derecho` → cambiar la localización del punto de vista.
*  (En ambos modos deberá arrastrar el ratón mientras hace click)
## Controles de la nave

Cuando la nave está en la escena:

* `W` → Acelerar hacia adelante.
* `S` → Ir hacia atrás (marcha atrás).
* `A` → Rotar la nave a la izquierda.
* `D` → Rotar la nave hacia la derecha.
* `Q` → Girar a la izquierda.
* `E` → Girar a la derecha.



## Animación

* Los planetas se recolocan en su órbita en función del tiempo simulado.
* Las lunas se recolocan alrededor de su planeta.
* Los planetas y lunas rotan sobre su propio eje para dar más realismo.
* La nave se mueve según las teclas pulsadas en ese momento.
* La cámara activa (vista sistema o vista nave) se actualiza y se usa para renderizar.

Video de demostración: https://youtu.be/pGywNdpJDZ8


(Codigo de acceso para el codigo en codesandbox: https://codesandbox.io/p/sandbox/tarea-6-estrella-y-planetas-con-click-9l95wk)

