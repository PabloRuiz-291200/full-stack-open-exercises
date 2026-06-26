const Header = ({ name }) => {
  return <h2>{name}</h2>
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part
          key={part.id}
          name={part.name}
          exercises={part.exercises}
        />
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return <strong>Total of {total} exercises</strong>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course