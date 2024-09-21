import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = (props) => {

    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };


    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "#e0e0d1",
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: 'grab',
                    },
                },
                modes: {
                    push: {
                        distance: 200,
                        duration: 15,
                        quantity: 4,
                    },
                    grab: {
                        distance: 150,
                    },
                },
            },
            particles: {
                number: {
                    value: 150, // Base number of particles on screen
                    density: {
                        enable: true,
                        value_area: 800, // Adjusts density relative to area
                    },
                },
                color: {
                    value: "#006600",
                },
                links: {
                    color: "#99003d",
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: true,
                    speed: 2,
                    straight: false,
                },
                life: {
                    duration: {
                        sync: false,
                        value: 30, // Particle lifespan in seconds
                    },
                    count: 0, // Infinite regeneration
                },
                opacity: {
                    value: 0.6,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 3, max: 8 },
                },
            },
            detectRetina: true,
        }),
        []
    );



    return <Particles id={props.id} init={particlesLoaded} options={options} />;
};

export default ParticlesComponent;