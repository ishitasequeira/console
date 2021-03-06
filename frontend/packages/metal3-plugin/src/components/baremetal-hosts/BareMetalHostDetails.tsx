import * as React from 'react';
import * as _ from 'lodash';
import {
  referenceForModel,
  K8sResourceKind,
  MachineKind,
  NodeKind,
} from '@console/internal/module/k8s';
import {
  SectionHeading,
  Timestamp,
  humanizeDecimalBytes,
  ResourceLink,
} from '@console/internal/components/utils';
import { NodeModel } from '@console/internal/models';
import {
  getName,
  getMachineNode,
  getMachineNodeName,
  getNamespace,
  getMachineRole,
  StatusIconAndText,
} from '@console/shared';
import { getHostStatus } from '../../status/host-status';
import {
  getHostNICs,
  getHostDescription,
  getHostBMCAddress,
  getHostCPU,
  getHostRAMMiB,
  getHostTotalStorageCapacity,
  getHostMachineName,
  getHostPowerStatus,
  getHostVendorInfo,
  getHostMachine,
  findNodeMaintenance,
  getHostBios,
} from '../../selectors';
import { BareMetalHostKind } from '../../types';
import MachineLink from './MachineLink';
import BareMetalHostPowerStatusIcon from './BareMetalHostPowerStatusIcon';
import BareMetalHostStatus from './BareMetalHostStatus';

type BareMetalHostDetailsProps = {
  obj: BareMetalHostKind;
  machines: MachineKind[];
  nodes: NodeKind[];
  nodeMaintenances: K8sResourceKind[];
};

const BareMetalHostDetails: React.FC<BareMetalHostDetailsProps> = ({
  obj: host,
  machines,
  nodes,
  nodeMaintenances,
}) => {
  const { creationTimestamp } = host.metadata;
  const namespace = getNamespace(host);
  const nics = getHostNICs(host);
  const ips = nics.map((nic) => nic.ip).join(', ');
  const machineName = getHostMachineName(host);
  const machine = getHostMachine(host, machines);
  const nodeName = getMachineNodeName(machine);
  const node = getMachineNode(machine, nodes);
  const role = getMachineRole(machine);
  const RAMGB = humanizeDecimalBytes(getHostRAMMiB(host) * 2 ** 20).string;
  const totalStorageCapacity = humanizeDecimalBytes(getHostTotalStorageCapacity(host)).string;
  const description = getHostDescription(host);
  const powerStatus = getHostPowerStatus(host);
  const { count: CPUCount, model: CPUModel } = getHostCPU(host);
  const { manufacturer, productName, serialNumber } = getHostVendorInfo(host);
  const bios = getHostBios(host);

  const nodeMaintenance = findNodeMaintenance(nodeMaintenances, nodeName);
  const status = getHostStatus({ host, machine, node, nodeMaintenance });

  return (
    <div className="co-m-pane__body">
      <SectionHeading text="Bare Metal Host Overview" />
      <div className="row">
        <div className="col-xs-12 col-sm-6" id="name-description-column">
          <dl>
            <dt>Name</dt>
            <dd>{getName(host)}</dd>
            {description && (
              <>
                <dt>Description</dt>
                <dd>{description}</dd>
              </>
            )}
            <dt>Host Addresses</dt>
            <dd>
              Management: {getHostBMCAddress(host)}
              <br />
              NICs: {ips}
            </dd>
            {machineName && (
              <>
                <dt>Machine</dt>
                <dd>
                  <MachineLink host={host} />
                </dd>
              </>
            )}
            {nodeName && (
              <>
                <dt>Node</dt>
                <dd>
                  <ResourceLink
                    kind={referenceForModel(NodeModel)}
                    name={nodeName}
                    namespace={namespace}
                    title={nodeName}
                  />
                </dd>
              </>
            )}
            <dt>Created at</dt>
            <dd>
              <Timestamp timestamp={creationTimestamp} />
            </dd>
          </dl>
        </div>
        <div className="col-xs-12 col-sm-6">
          <dl>
            <dt>Status</dt>
            <dd>
              <BareMetalHostStatus {...status} />
            </dd>
            <dt>Power Status</dt>
            <dd>
              <StatusIconAndText
                title={powerStatus}
                icon={<BareMetalHostPowerStatusIcon powerStatus={powerStatus} />}
              />
            </dd>
            {role && (
              <>
                <dt>Role</dt>
                <dd>{role}</dd>
              </>
            )}
            {(manufacturer || productName) && (
              <>
                <dt>Model</dt>
                <dd>{_.filter([manufacturer, productName]).join(', ')}</dd>
              </>
            )}
            {bios && (
              <>
                <dt>Bios</dt>
                <dd>
                  Version: {bios.version}
                  <br />
                  Vendor: {bios.vendor}
                  <br />
                  Date: {bios.date}
                </dd>
              </>
            )}
            {serialNumber && (
              <>
                <dt>Serial Number</dt>
                <dd>{serialNumber}</dd>
              </>
            )}
            {_.get(host, 'status.hardware') && (
              <>
                <dt>Hardware</dt>
                <dd>
                  {CPUCount}x {CPUModel} CPU
                  <br />
                  {RAMGB} RAM
                  <br />
                  {totalStorageCapacity} Disk
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default BareMetalHostDetails;
