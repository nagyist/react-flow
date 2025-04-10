import { derived } from 'svelte/store';
import { areConnectionMapsEqual, type HandleConnection, type HandleType } from '@xyflow/system';

import { useStore } from '$lib/store';
import { getContext } from 'svelte';

export type useHandleConnectionsParams = {
  type: HandleType;
  nodeId?: string;
  id?: string | null;
};

const initialConnections: HandleConnection[] = [];

/**
 *  Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @deprecated Use `useNodeConnections` instead.
 * @param param.nodeId
 * @param param.type - handle type 'source' or 'target'
 * @param param.id - the handle id (this is only needed if the node has multiple handles of the same type)
 * @returns an array with connections
 */
export function useHandleConnections({ type, nodeId, id }: useHandleConnectionsParams) {
  const { edges, connectionLookup } = useStore();

  console.warn(
    '[DEPRECATED] `useHandleConnections` is deprecated. Instead use `useNodeConnections` https://svelteflow.dev/api-reference/hooks/useNodeConnections'
  );

  const _nodeId = getContext<string>('svelteflow__node_id');
  const currentNodeId = nodeId ?? _nodeId;

  let prevConnections: Map<string, HandleConnection> | undefined = undefined;

  return derived(
    [edges, connectionLookup],
    ([, connectionLookup], set) => {
      const nextConnections = connectionLookup.get(`${currentNodeId}-${type}${id ? `-${id}` : ''}`);

      if (!areConnectionMapsEqual(nextConnections, prevConnections)) {
        prevConnections = nextConnections;
        set(Array.from(prevConnections?.values() || []));
      }
    },
    initialConnections
  );
}
