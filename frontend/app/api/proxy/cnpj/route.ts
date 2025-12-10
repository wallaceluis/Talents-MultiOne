
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj');

    if (!cnpj) {
        return NextResponse.json({ message: 'CNPJ is required' }, { status: 400 });
    }

    const cleanCNPJ = cnpj.replace(/\D/g, '');

    try {
        const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCNPJ}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour to save quotes
        });

        if (!response.ok) {
            // ReceitaWS returns 200 even for errors usually, but if it returns 429/etc
            return NextResponse.json({ message: 'Error fetching from ReceitaWS' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
