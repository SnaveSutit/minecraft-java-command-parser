import { ISyntaxToken, ISyntaxTokens, TokenStream } from '../../parsers/vanillaParser';
import { AnyCommandSyntaxToken } from '../vanillaCommands';
export interface IExecuteSubCommandToken<N> extends ISyntaxToken<'executeSubCommand'> {
    name: N;
}
export type AnyExecuteSubCommand = IExecuteSubCommandTokens[keyof IExecuteSubCommandTokens];
export type ExecuteStoreSubCommandDataType = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short';
export interface IExecuteArgTypes {
    maskMode: (ISyntaxTokens['literal'] & {
        value: 'all' | 'masked';
    }) | undefined;
}
export interface IExecuteSubCommandTokens {
    align: IExecuteSubCommandToken<'align'> & {
        swizzle: string;
    };
    anchored: IExecuteSubCommandToken<'anchored'> & {
        anchor: 'eyes' | 'feet';
    };
    as: IExecuteSubCommandToken<'as'> & {
        target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal'];
    };
    at: IExecuteSubCommandToken<'at'> & {
        target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal'];
    };
    facing: IExecuteSubCommandToken<'facing'> & ({
        entityBranch: false;
        position: ISyntaxTokens['vec3'];
    } | {
        entityBranch: true;
        target: ISyntaxTokens['targetSelector'] | ISyntaxTokens['literal'];
        anchor: 'eyes' | 'feet';
    });
    in: IExecuteSubCommandToken<'in'> & {
        dimension: ISyntaxTokens['resourceLocation'];
    };
    on: IExecuteSubCommandToken<'on'> & {
        target: 'attacker' | 'controller' | 'leasher' | 'owner' | 'passengers' | 'target' | 'vehicle';
    };
    positioned: IExecuteSubCommandToken<'positioned'> & ({
        asBranch: true;
        target: ISyntaxTokens['targetSelector'];
    } | {
        asBranch: false;
        position: ISyntaxTokens['vec3'];
    });
    rotated: IExecuteSubCommandToken<'rotated'> & ({
        asBranch: true;
        target: ISyntaxTokens['targetSelector'];
    } | {
        asBranch: false;
        rotation: ISyntaxTokens['vec2'] & {
            xSpaceMod?: '~';
            ySpaceMod?: '~';
        };
    });
    store: IExecuteSubCommandToken<'store'> & {
        storeMode: 'result' | 'success';
    } & ({
        storeBranch: 'block';
        targetPos: ISyntaxTokens['vec3'];
        path: ISyntaxTokens['nbtPath'];
        dataType: ExecuteStoreSubCommandDataType;
        scale: ISyntaxTokens['int' | 'float'];
    } | {
        storeBranch: 'bossbar';
        bossbar: ISyntaxTokens['resourceLocation'];
        bossbarMode: 'value' | 'max';
    } | {
        storeBranch: 'entity';
        target: ISyntaxTokens['targetSelector'];
        path: ISyntaxTokens['nbtPath'];
        dataType: ExecuteStoreSubCommandDataType;
        scale: ISyntaxTokens['int' | 'float'];
    } | {
        storeBranch: 'score';
        target: ISyntaxTokens['targetSelector'];
        targetObjective: ISyntaxTokens['literal'];
    } | {
        storeBranch: 'storage';
        storage: ISyntaxTokens['resourceLocation'];
        path: ISyntaxTokens['nbtPath'];
        dataType: ExecuteStoreSubCommandDataType;
        scale: ISyntaxTokens['int' | 'float'];
    });
    if: IExecuteSubCommandToken<'if' | 'unless'> & ({
        conditionBranch: 'block';
        position: ISyntaxTokens['vec3'];
        block: ISyntaxTokens['block'];
    } | {
        conditionBranch: 'blocks';
        start: ISyntaxTokens['vec3'];
        end: ISyntaxTokens['vec3'];
        target: ISyntaxTokens['vec3'];
        maskMode: IExecuteArgTypes['maskMode'];
    } | ({
        conditionBranch: 'data';
    } & ({
        dataBranch: 'block';
        sourcePos: ISyntaxTokens['vec3'];
        path: ISyntaxTokens['nbtPath'];
    } | {
        dataBranch: 'entity';
        source: ISyntaxTokens['targetSelector'];
        path: ISyntaxTokens['nbtPath'];
    } | {
        dataBranch: 'storage';
        source: ISyntaxTokens['resourceLocation'];
        path: ISyntaxTokens['nbtPath'];
    })) | {
        conditionBranch: 'entity';
        target: ISyntaxTokens['targetSelector'];
    } | {
        conditionBranch: 'predicate';
        predicate: ISyntaxTokens['resourceLocation'];
    } | ({
        conditionBranch: 'score';
        target: ISyntaxTokens['targetSelector'];
        targetObjective: ISyntaxTokens['literal'];
    } & ({
        matchesBranch: true;
        range: ISyntaxTokens['intRange'];
    } | {
        matchesBranch: false;
        operation: '<=' | '<' | '=' | '>' | '>=';
        source: ISyntaxTokens['targetSelector'];
        sourceObjective: ISyntaxTokens['literal'];
    })) | {
        conditionBranch: 'dimension';
        dimension: ISyntaxTokens['resourceLocation'];
    } | {
        conditionBranch: 'loaded';
        position: ISyntaxTokens['vec3'];
    });
    unless: IExecuteSubCommandTokens['if'];
    run: IExecuteSubCommandToken<'run'> & {
        command: AnyCommandSyntaxToken;
    };
}
export declare const parseExecuteCommand: (s: TokenStream) => import("../vanillaCommands").ISyntaxTokenCommand<"execute"> & {
    subCommands: AnyExecuteSubCommand[];
};
