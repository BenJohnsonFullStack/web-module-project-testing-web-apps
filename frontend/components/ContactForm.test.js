import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
    expect(header).toBeVisible();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, 'Ben');
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');
    const userInputs = screen.getAllByRole('textbox');
    userEvent.type(userInputs, '');
    userEvent.click(submitButton);
    const allErrorMessages = await screen.findAllByTestId('error');
    expect(allErrorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');
    const userInputs = screen.getAllByRole('textbox');
    userEvent.type(userInputs[0], 'Benjamin');
    userEvent.type(userInputs[1], 'Johnson');
    userEvent.type(userInputs[2], '');
    userEvent.click(submitButton);
    const emailErrorMessage = await screen.findAllByTestId('error');
    expect(emailErrorMessage).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, 'joey');
    const emailErrorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(emailErrorMessage).toHaveTextContent("email must be a valid email address");
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const submitButton = screen.getByRole('button');
    userEvent.type(lastNameInput, '');
    userEvent.click(submitButton);
    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toHaveTextContent("lastName is a required field");
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    const userInputs = screen.getAllByRole('textbox');

    userEvent.type(userInputs[0], 'Benjamin');
    userEvent.type(userInputs[1], 'Johnson');
    userEvent.type(userInputs[2], 'monk.sound.design@gmail.com');
    userEvent.type(userInputs[3], '');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstDisplay = screen.queryByText(/benjamin/i);
        const lastDisplay = screen.queryByText(/johnson/i);
        const emailDisplay = screen.queryByText(/monk.sound.design@gmail.com/i);
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstDisplay).toBeInTheDocument();
        expect(lastDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    const userInputs = screen.getAllByRole('textbox');

    userEvent.type(userInputs[0], 'Benjamin');
    userEvent.type(userInputs[1], 'Johnson');
    userEvent.type(userInputs[2], 'monk.sound.design@gmail.com');
    userEvent.type(userInputs[3], 'message for the masses');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstDisplay = screen.queryByText(/benjamin/i);
        const lastDisplay = screen.queryByText(/johnson/i);
        const emailDisplay = screen.queryByText(/monk.sound.design@gmail.com/i);
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstDisplay).toBeInTheDocument();
        expect(lastDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});
