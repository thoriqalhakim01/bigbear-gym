<?php
namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $package = [
            [
                'name'     => 'Pay/visit',
                'price'    => 50000,
                'points'   => 0,
                'duration' => 0,
            ],
            [
                'name'     => 'Gold',
                'price'    => 2000000,
                'points'   => 50,
                'duration' => 180,
            ],
            [
                'name'     => 'Silver',
                'price'    => 1800000,
                'points'   => 40,
                'duration' => 180,
            ],
        ];

        foreach ($package as $key => $value) {
            Package::create([
                'name'     => $value['name'],
                'price'    => $value['price'],
                'points'   => $value['points'],
                'duration' => $value['duration'],
            ]);
        }
    }
}
