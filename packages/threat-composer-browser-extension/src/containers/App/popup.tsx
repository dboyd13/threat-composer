/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';
import { FC } from 'react';
import * as React from 'react';

const App: FC = () => {
  const [integrationGitHubBrowserEnabled, setChecked] = React.useState(true);
  const [selectedOption] = React.useState({
    label: 'Built-in, extension hosted version',
    value: 'seg-1',
  });
  const [value, setValue] = React.useState('');
  return (
    <Box>
      <SpaceBetween size="xs">
        <Header variant="h1">Threat Composer Viewer</Header>
        <Container>
          <SpaceBetween size="xs">
            <div>
              <Header>'View Raw' file integration</Header>
            </div>
            <ColumnLayout columns={2}>
              <div>
                <Toggle
                  onChange={({ detail }) => setChecked(detail.checked)}
                  checked={integrationGitHubBrowserEnabled}
                >
                Anywhere <small>(*.tc.json)</small>
                </Toggle>
              </div>
              <div>
                <Button iconName="settings" variant="icon" />
              </div>
            </ColumnLayout>
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="xs">
            <div>
              <Header>Code Browser Integrations</Header>
            </div>
            <div>
              <Toggle
                onChange={({ detail }) => setChecked(detail.checked)}
                checked={integrationGitHubBrowserEnabled}
              >
                GitHub <small>(github.com/*)</small>
              </Toggle>
              <Toggle
                onChange={({ detail }) => setChecked(detail.checked)}
                checked={integrationGitHubBrowserEnabled}
              >
                Amazon Code <small>(code.amazon.com/*</small>)
              </Toggle>
              <Toggle
                onChange={({ detail }) => setChecked(detail.checked)}
                checked={integrationGitHubBrowserEnabled}
              >
                Amazon CodeCatalyst <small>(codecatalyst.aws/*</small>)
              </Toggle>
            </div>
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="xs">
            <div>
              <Header>Open with</Header>
            </div>
            <div>
              <Select
                selectedOption={selectedOption}
                options={[
                  {
                    label: 'Built-in, extension hosted version',
                    value: 'seg-1',
                  },
                  {
                    label:
                      'GitHub pages hosted version (threat-composer.github.io)',
                    value: 'seg-2',
                  },
                  { label: 'Self hosted version', value: 'seg-3' },
                ]}
              />
              {selectedOption.value == 'seg-3' ? (
                <FormField label="URL of self hosted version">
                  <Input
                    onChange={({ detail }) => setValue(detail.value)}
                    value={value}
                    placeholder="https://"
                  />
                </FormField>
              ) : null}
            </div>
          </SpaceBetween>
        </Container>
        <Button>Restore defaults</Button>
      </SpaceBetween>
    </Box>
  );
};

export default App;
