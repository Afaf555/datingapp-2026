using System;
namespace API.Entities;
using System.Text.Json.Serialization;
public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }

    [JsonIgnore]
public Member Member {get; set;}=null!; //ova e vrska do drug entitet (member)
    public string MemberId {get; set;}=null!;

}