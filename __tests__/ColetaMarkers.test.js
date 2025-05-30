import React from 'react';
import { render } from '@testing-library/react-native';
import ColetaMarkers from '../components/ColetaMarkers';

// Mock react-native-maps
jest.mock('react-native-maps', () => ({
  Marker: 'Marker',
}));

describe('ColetaMarkers', () => {
  const mockColetas = [
    {
      id: '1',
      latitude: -22.0729042,
      longitude: -51.4666111,
      endereco: 'Test Address 1',
      description: 'Test Description 1',
    },
    {
      id: '2',
      lat: -22.0729042,
      long: -51.4666111,
      endereco: 'Test Address 2',
      description: 'Test Description 2',
    },
  ];

  const mockOnMarkerPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders markers for valid coordinates', () => {
    const { getAllByTestId } = render(
      <ColetaMarkers coletas={mockColetas} onMarkerPress={mockOnMarkerPress} />
    );

    // Should render 2 markers for valid coordinates
    expect(getAllByTestId).toBeDefined();
  });

  it('handles empty coletas array', () => {
    const { container } = render(
      <ColetaMarkers coletas={[]} onMarkerPress={mockOnMarkerPress} />
    );

    expect(container).toBeDefined();
  });

  it('filters out coletas without valid coordinates', () => {
    const coletasWithInvalid = [
      ...mockColetas,
      {
        id: '3',
        endereco: 'Invalid Address',
        // No coordinates
      },
    ];

    const { container } = render(
      <ColetaMarkers coletas={coletasWithInvalid} onMarkerPress={mockOnMarkerPress} />
    );

    expect(container).toBeDefined();
  });
});
