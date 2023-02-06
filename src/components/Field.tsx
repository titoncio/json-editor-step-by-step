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

interface FieldProps {
    sdk: FieldExtensionSDK;
}

interface Step {
    icon: string;
    title: string;
    description: string;
}

function createStep(): Step {
    return {
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

    const createOnChangeHandler = (index: number, step: Step, property: 'icon' | 'title' | 'description') => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const stepList = steps.concat();

        stepList.splice(index, 1, { ...step, [property]: e.target.value });

        props.sdk.field.setValue(stepList);
    };

    const deleteStep = (index: number) => {
        steps.splice(index, 1)
        props.sdk.field.setValue(steps);
    };

    return (
        <div>
            <Table>
                <TableBody>
                    {steps.map((step, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField
                                    id="icon"
                                    name="icon"
                                    labelText="Icon Name"
                                    value={step.icon}
                                    onChange={createOnChangeHandler(index, step, 'icon')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="title"
                                    name="title"
                                    labelText="Step Title"
                                    value={step.title}
                                    onChange={createOnChangeHandler(index, step, 'title')}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id="description"
                                    name="description"
                                    labelText="Step Description"
                                    value={step.description}
                                    onChange={createOnChangeHandler(index, step, 'description')}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <EditorToolbarButton
                                    label="delete"
                                    icon="Delete"
                                    onClick={() => deleteStep(index)}
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
