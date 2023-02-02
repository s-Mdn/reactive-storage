export function isNative (Ctor) {
    return typeof Ctor && /native code/.test(Ctor.toString())
}

export var hasReflect = Reflect && isNative(Reflect.defineProperty);