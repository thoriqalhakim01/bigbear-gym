<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTrainerRequest;
use App\Http\Requests\Admin\UpdateTrainerRequest;
use App\Models\Trainer;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function index()
    {
        $query = Trainer::query()->orderBy('created_at', 'desc');

        $search = request('search');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(rfid_uid) LIKE ?', ['%' . strtolower($search) . '%'])
                ;
            });
        }

        $trainers = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/trainers/index', [
            'trainers' => $trainers,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'filters'  => [
                'search' => request('search', ''),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/trainers/create');
    }

    public function store(StoreTrainerRequest $request)
    {
        $validated = $request->validated();

        Trainer::create($validated);

        return redirect()->route('trainers.index')->with('success', 'Trainer created successfully.');
    }

    public function show(string $id)
    {
        $trainer = Trainer::with(['members', 'attendances'])->FindOrFail($id);

        return Inertia::render('admin/trainers/show', [
            'trainer' => $trainer,
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function edit(string $id)
    {
        $trainer = Trainer::FindOrFail($id);

        return Inertia::render('admin/trainers/edit', [
            'trainer' => $trainer,
        ]);
    }

    public function update(UpdateTrainerRequest $request, string $id)
    {
        $validated = $request->validated();

        $trainer = Trainer::FindOrFail($id);

        $trainer->update([
            'full_name'    => $validated['full_name'],
            'email'        => $validated['email'],
            'phone_number' => $validated['phone_number'],
        ]);

        return redirect()->route('trainers.show', $trainer->id)->with('success', 'Trainer updated successfully');
    }

    public function destroy(string $id)
    {
        $trainer = Trainer::FindOrFail($id);

        $trainer->delete();

        return redirect()->route('trainers.index')->with('success', 'Trainer deleted successfully');
    }
}
