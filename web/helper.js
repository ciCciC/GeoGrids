const dashArraySeq = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5]
];

const animateDash = async (layerId) => {
    let step = 0;

    function animateDashArray(timestamp) {
        const newStep = parseInt(
            (timestamp / 60) % dashArraySeq.length
        );

        if (newStep !== step) {
            map.setPaintProperty(
                layerId,
                'line-dasharray',
                dashArraySeq[step]
            );
            step = newStep;
        }

        requestAnimationFrame(animateDashArray);
    }

    animateDashArray(0);
}