using TireStore.Application.Abstractions;
using TireStore.Domain.Entities;

namespace TireStore.Infrastructure;

public sealed class InMemoryStore : ICreditRepository, IOrderRepository
{
    private readonly object gate = new();
    private readonly List<Order> orders = new();
    private readonly List<Installment> installments = new();
    private CreditRequestState? creditRequest;
    private decimal creditLimit;
    private decimal creditUsed;
    private string creditStatus = "None";
    private int nextOrderId = 1000;
    private int nextInstallmentId = 5000;

    public Credit Get()
    {
        lock (gate) return new Credit(creditLimit, creditUsed, creditStatus);
    }

    public void Approve(decimal limit)
    {
        lock (gate)
        {
            creditLimit = limit;
            creditStatus = "Approved";
            if (creditRequest is not null) creditRequest = creditRequest with { Status = "Approved" };
        }
    }

    public void AddUsed(decimal delta)
    {
        lock (gate) creditUsed = Math.Max(0, creditUsed + delta);
    }

    public CreditRequestState? GetRequest()
    {
        lock (gate) return creditRequest;
    }

    public void SetRequest(CreditRequestState request)
    {
        lock (gate)
        {
            creditRequest = request;
            creditStatus = "Pending";
        }
    }

    public Order Add(Order order, IReadOnlyList<Installment> items)
    {
        lock (gate)
        {
            orders.Add(order);
            foreach (var item in items) item.Id = nextInstallmentId++;
            installments.AddRange(items);
            return order;
        }
    }

    public int NextOrderId()
    {
        lock (gate) return nextOrderId++;
    }

    public IReadOnlyList<Order> GetAll()
    {
        lock (gate) return orders.ToList();
    }

    public Order? Get(int id)
    {
        lock (gate) return orders.FirstOrDefault(o => o.Id == id);
    }

    public IReadOnlyList<Installment> GetInstallments()
    {
        lock (gate) return installments.ToList();
    }

    public Installment? GetInstallment(int id)
    {
        lock (gate) return installments.FirstOrDefault(i => i.Id == id);
    }

    public Installment? GetInstallmentByTrackerId(string trackerId)
    {
        lock (gate) return installments.FirstOrDefault(i => i.PaymentTrackerId == trackerId);
    }
}
