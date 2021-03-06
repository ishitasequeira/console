import {
  sampleDeploymentConfigs,
  MockResources,
  sampleDeployments,
} from '../../components/topology/__tests__/topology-test-data';
import { getPipelinesAndPipelineRunsForResource } from '../pipeline-plugin-utils';

describe('pipeline-plugin-utils', () => {
  it('should return undefined when there are no pipeline and pipeline runs', () => {
    expect(getPipelinesAndPipelineRunsForResource(sampleDeploymentConfigs.data[0], {})).toBeNull();
  });

  it('should return null when instance label is not available', () => {
    expect(
      getPipelinesAndPipelineRunsForResource(sampleDeployments.data[0], MockResources),
    ).toBeNull();
  });

  it('should return pipeline and pipeline runs when instance label is present on resource', () => {
    const pipelines = getPipelinesAndPipelineRunsForResource(
      sampleDeploymentConfigs.data[0],
      MockResources,
    );
    expect(pipelines).toHaveProperty('pipeline');
    expect(pipelines).toHaveProperty('pipelineRuns');
    expect(pipelines.pipelineRuns).toHaveLength(1);
  });
});
