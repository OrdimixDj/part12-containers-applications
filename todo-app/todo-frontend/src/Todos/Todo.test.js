import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('Todo renders correctly', () => {
    const todo = {
        text: 'Learn about containers',
        done: false
    }

    const mockDelete = jest.fn()
    const mockComplete = jest.fn()

    render(<Todo todo={todo} onClickDelete={mockDelete} onClickComplete={mockComplete} />)

    expect(screen.getByText('Learn about containers')).toBeInTheDocument()
    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
})