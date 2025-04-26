'use client'
import { Fragment } from 'react'
import { StateProps } from './type'

export function StateError({ meta: { errors, isValidating, isTouched } }: StateProps) {
    return (
        <Fragment>
            {errors.length > 0 && (
                <p className='text-sm text-red-500'>
                    {(isTouched && errors.map((error: any) => error?.message).join(', ')) ||
                        errors.map((error: any) => error).join(', ')}
                </p>
            )}
            {isValidating ? 'Validating...' : null}
        </Fragment>
    )
}
