import React, { useEffect, useState } from 'react';
import {
    Button,
    EditorToolbarButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { v4 as uuid } from 'uuid';

interface FieldProps {
    sdk: FieldExtensionSDK;
}

interface Step {
    id: string;
    icon: string;
    title: string;
    description: string;
}

function createStep(): Step {
    return {
        id: uuid(),
        icon: '',
        title: '',
        description: ''
    };
}

const Field = (props: FieldProps) => {
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        props.sdk.window.startAutoResizer();

        props.sdk.field.onValueChanged((value: Step[]) => {
            if (Array.isArray(value)) {
                setSteps(value);
            }
        });
    });

    const addNewStep = () => {
        props.sdk.field.setValue([...steps, createStep()]);
    };

    const createOnChangeHandler = (step: Step, property: 'icon' | 'title' | 'description') => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const stepList = steps.concat();
        const index = stepList.findIndex((i) => i.id === step.id);

        stepList.splice(index, 1, { ...step, [property]: e.target.value });

        props.sdk.field.setValue(stepList);
    };

    const deleteStep = (step: Step) => {
        props.sdk.field.setValue(steps.filter((i) => i.id !== step.id));
    };

    return (
        <div>
            <Table>
                <TableBody>
                    {steps.map((step) => (
                        <TableRow key={step.id}>
                            <TableCell>
                                <TextField
                                    id="icon"
                                    name="icon"
                                    labelText="Icon Name"
                                    value={step.icon}
                                    onChange={createOnChangeHandler(step, 'icon')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="title"
                                    name="title"
                                    labelText="Step Title"
                                    value={step.title}
                                    onChange={createOnChangeHandler(step, 'title')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="description"
                                    name="description"
                                    labelText="Step Description"
                                    value={step.description}
                                    onChange={createOnChangeHandler(step, 'description')}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <EditorToolbarButton
                                    label="delete"
                                    icon="Delete"
                                    onClick={() => deleteStep(step)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                buttonType="naked"
                onClick={addNewStep}
                icon="PlusCircle"
                style={{ marginTop: tokens.spacingS }}
            >
                Add Step
            </Button>
        </div>
    );
};

export default Field;
