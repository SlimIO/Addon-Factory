declare namespace Factories {
    interface AddonOptions {
        splitCallbackRegistration?: boolean;
    }

    declare class AddonFactory {
        constructor(name: string, options?: AddonOptions);

        public name: string;
        public splitCallbackRegistration: boolean;
        public callbacks: Set<string>;
        public schedules: Map<string, string>;

        addCallback(callback: CallbackFactory): this;
        scheduleCallback(callbackName: string, options: any): this;
        generate(path: string): Promise<this>;
    }

    declare class CallbackFactory {
        constructor(name: string);

        public name: string;
        public returnValue: string;

        return(value: any): this;
        toString(): string;
    }

    export interface Factory {
        CallbackFactory: typeof CallbackFactory;
        AddonFactory: typeof AddonFactory;
    }
}

export as namespace Factories;
export = Factories;
