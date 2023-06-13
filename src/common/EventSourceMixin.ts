export class EventMixin {
    private subscribers: Record<string, any[]> = {}

    pushEvent(event: string, sub: any[]): void {
        const subs = this.subscribers ?? (this.subscribers = {})
        subs[event] || (subs[event] = [])
        subs[event].push(sub)
    }

    on(event: string, callback: (...args: any[]) => void): void {
        this.pushEvent(event, [true, callback])
    }

    once(event: string, callback: (...args: any[]) => void): void {
        this.pushEvent(event, [false, callback])
    }

    un(event: string, subToUn: any): void {
        const subs = this.subscribers
        if (subs?.[event]) {
            subs[event] = subs[event].filter(sub => sub !== subToUn)
        }
    }

    trigger(event: string, data: any = null): void {
        const subs = this.subscribers
        if (subs?.[event]) {
            subs[event].forEach(sub => {
                sub[1](event, data, this)
            })
            subs[event] = subs[event].filter(sub => sub[0])
        }
    }
}

export const myEventMixin = new EventMixin()
