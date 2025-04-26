'use client'
import { Fragment } from 'react'
import { StateProps } from './type'

export function StateInfo({ meta: { errors, isValidating, isTouched } }: StateProps) {
    return (
        <Fragment>
            {errors.length > 0 && (
                <p className='text-sm text-yellow-500'>
                    {(isTouched && errors.map((error: any) => error?.message).join(', ')) ||
                        (errors && errors.map((error: any) => error).join(', '))}
                </p>
            )}
            {isValidating ? 'Validating...' : null}
        </Fragment>
    )
}
