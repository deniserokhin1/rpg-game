export function clamp(x, from_x, to_x) {
    // console.log('x:', x)
    // console.log('from_x:', from_x)
    // console.log('to_x:', to_x)

    if (x < from_x) x = from_x
    if (x > to_x) x = to_x

    return x
}

export function animateEx(dx, startTime, currentTime, speed, looped = false) {
    const diff = currentTime - startTime

    // if (!looped) {
    //     console.log('diff:', diff)
    // }

    let time = (speed && diff / speed) || 0

    if (looped) {
        time = time % 1
    } else if (time > 1) {
        time = 1
    }

    return { offset: dx * time, progress: time }
}
