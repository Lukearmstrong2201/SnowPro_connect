export default function BioSection({ instructor }) {
  return (
    <div>
      <h2>Your Bio</h2>
      <p>
        <strong>Name:</strong> {instructor.first_name} {instructor.last_name}
      </p>
      <p>
        <strong>Email:</strong> {instructor.email}
      </p>
      <p>
        <strong>Certificate:</strong> {instructor.level_of_qualification}
      </p>
      <p>
        <strong>Local Resort:</strong>{" "}
        {instructor.local_resort || "No resort selected"}
      </p>
    </div>
  );
}
