import * as React from 'react';
import { FormSelect, FormSelectOption, Split, SplitItem } from '@patternfly/react-core';
import { ValidationObject } from '@console/shared';
import { prefixedID } from '../../utils';
import { getStringEnumValues } from '../../utils/types';
import { FormRow } from './form-row';
import { Integer } from './integer/integer';

import './size-unit-form-row.scss';

export enum BinaryUnit {
  B = 'B',
  Ki = 'Ki',
  Mi = 'Mi',
  Gi = 'Gi',
  Ti = 'Ti',
}

type SizeUnitFormRowProps = {
  size: string;
  title?: string;
  unit: BinaryUnit;
  units?: BinaryUnit[];
  validation: ValidationObject;
  id?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  onSizeChanged?: (size: string) => void;
  onUnitChanged?: (unit: BinaryUnit) => void;
};
export const SizeUnitFormRow: React.FC<SizeUnitFormRowProps> = ({
  title = 'Size',
  size,
  unit,
  units,
  validation,
  id,
  isRequired,
  isDisabled,
  onSizeChanged = () => undefined,
  onUnitChanged = () => undefined,
}) => (
  <FormRow
    key="size"
    title={title}
    fieldId={prefixedID(id, 'size')}
    isRequired={isRequired}
    validation={validation}
  >
    <Split>
      <SplitItem isFilled>
        <Integer
          className="kubevirt-size-unit-form-row__size"
          isDisabled={isDisabled}
          id={prefixedID(id, 'size')}
          value={size}
          isPositive
          onChange={React.useCallback((v) => onSizeChanged(v), [onSizeChanged])}
        />
      </SplitItem>
      <SplitItem>
        <FormSelect
          className="kubevirt-size-unit-form-row__unit"
          onChange={React.useCallback((u) => onUnitChanged(u as BinaryUnit), [onUnitChanged])}
          value={unit}
          id={prefixedID(id, 'unit')}
          isDisabled={isDisabled}
        >
          {(units || getStringEnumValues<BinaryUnit>(BinaryUnit)).map((u) => (
            <FormSelectOption key={u} value={u} label={u} />
          ))}
        </FormSelect>
      </SplitItem>
    </Split>
  </FormRow>
);
