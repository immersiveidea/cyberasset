import {Button, NavLink} from "@mantine/core";

export default function Solutions() {
    const solutions = [];
    for (let i = 0; i < 10; i++) {
        solutions.push({id: i, name: 'Solution ' + i});
    }
    //            <NavLink to={'/solution/' + solution.id}>{solution.name}</NavLink>
    return (
        <div>
            <Button>Solutions</Button>
            {solutions.map((solution) => {
                return <NavLink to={'/solution/' + solution.id} label={solution.name}/>
            })}
            <NavLink label="New"/>
        </div>
    )
}