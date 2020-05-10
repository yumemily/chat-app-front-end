import React from 'react'

export default function Header(props) {
    return (
        <div>
            Welcome, {props.user ? props.user.name : "Guest"}!
        </div>
    )
}
