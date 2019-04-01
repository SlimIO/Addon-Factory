declare namespace Factories {
    interface AddonOptions {
        version?: string;
        splitCallbackRegistration?: boolean;
    }

    class ComponentFactory {
        constructor();

        toString(addonName: string): string;
    }

    class Message extends ComponentFactory {
        constructor(target: string);

        arg(value: any): this;
        toString(addonName: string): string;
    }

    export class AddonFactory {
        constructor(name: string, options?: AddonOptions);

        public name: string;
        public version: string;
        public splitCallbackRegistration: boolean;
        public callbacks: Set<string>;
        public schedules: Map<string, string>;

        addCallback(callback: CallbackFactory): this;
        scheduleCallback(callbackName: string, options: any): this;
        generate(path: string): Promise<this>;
    }

    export class CallbackFactory {
        constructor(name: string);

        public name: string;
        public returnValue: string;
        public components: ComponentFactory[];

        add(component: ComponentFactory): this;
        return(value: any): this;
        toString(): string;
    }

    interface Components {
        Message: typeof Message;
    }

    export const Components: Components;

}

export as namespace Factories;
export = Factories;
